import { Component, OnInit } from '@angular/core';
import { Settings, AppSettings } from '../../app.settings';
import { AppService } from '../../app.service';
import { Property, Pagination } from '../../app.models';

import { Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  watcher: Subscription;
  activeMediaQuery = '';

  public slides = [];
  public properties;
  public viewType: string = 'grid';
  public viewCol: number = 25;
  public count: number = 8;
  public sort: string;
  public searchFields: any;
  public removedSearchField: string;
  public pagination: Pagination = new Pagination(1, 8, null, 2, 0, 0);
  public message: string;
  public featuredProperties: Property[];
  ContactInfo;
  public peopleArray;

  public settings: Settings;
  constructor(public appSettings: AppSettings, public appService: AppService, public mediaObserver: MediaObserver, public MyHttp: HttpClient) {
    this.settings = this.appSettings.settings;

    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      // console.log(change)
      if (change.mqAlias == 'xs') {
        this.viewCol = 100;
      }
      else if (change.mqAlias == 'sm') {
        this.viewCol = 50;
      }
      else if (change.mqAlias == 'md') {
        this.viewCol = 33.3;
      }
      else {
        this.viewCol = 25;
      }
    });

  }

  ngOnInit() {

    console.log(this.properties);
    this.getSlides();
    this.getProperties();
    console.dir(this.properties);
    // if (this.mediaObserver.isActive('xs')) {
    //    console.log('mobile version -XS')
    // }
    this.getFeaturedProperties();
  }

  ngDoCheck() {
    if (this.settings.loadMore.load) {
      this.settings.loadMore.load = false;
      this.getProperties();
    }
  }

  ngOnDestroy() {
    this.resetLoadMore();
    this.watcher.unsubscribe();
  }

  public getSlides() {
    this.appService.getHomeCarouselSlides().subscribe(res => {
      this.slides = res;
    })
  }

  public getProperties() {
    //console.log('get properties by : ', this.searchFields);

    //this.peopleArray = Object.keys(this.ContactInfo).map(i => this.ContactInfo[i])
    this.appService.gethomeProperties().subscribe(data => {
      this.properties = data['data']['properties'];
      console.log("Check")

      if (this.properties.length == 0) {
        this.properties.length = 0;
        this.pagination = new Pagination(1, this.count, null, 2, 0, 0);
        this.message = 'No Results Found';
        return false;
      }
      for (const property of this.properties) {
        property.propertyStatus = JSON.parse(property.propertyStatus);
        property.neighborhood = JSON.parse(property.neighborhood);
        property.street = JSON.parse(property.street);
        property.location = JSON.parse(property.location);
        property.features = JSON.parse(property.features);
        property.priceDollar = JSON.parse(property.priceDollar);
        property.priceEuro = JSON.parse(property.priceEuro);
        property.area = JSON.parse(property.area);
        property.additionalFeatures = JSON.parse(property.additionalFeatures);
        property.gallery = JSON.parse(property.gallery);
        property.plans = JSON.parse(property.plans);
        property.videos = JSON.parse(property.videos);
      }
    })

    // this.appService.getProperties().subscribe(data => { 
    //   let result = this.filterData(data); 
    //   if(result.data.length == 0){
    //     this.properties.length = 0;
    //     this.pagination = new Pagination(1, this.count, null, 2, 0, 0);  
    //     this.message = 'No Results Found';
    //     return false;
    //   } 
    //   this.properties = result.data; 
    //   this.pagination = result.pagination;
    //   this.message = null;
    // })

    // this.appService.getProperties().subscribe(data => {
    //   console.log("HI DATA");
    //   console.log(data);
    //   //console.log(peopleArray);
    //   if(this.properties && this.properties.length > 0){  
    //     this.settings.loadMore.page++;
    //     this.pagination.page = this.settings.loadMore.page; 
    //   }
    //   let result = this.filterData(data);
    //   if(result.data.length == 0){
    //     this.properties.length = 0;
    //     this.pagination = new Pagination(1, this.count, null, 2, 0, 0);  
    //     this.message = 'No Results Found';
    //     return false;
    //   }
    //   if(this.properties && this.properties.length > 0){  
    //     this.properties = this.properties.concat(result.data);          
    //   }
    //   else{
    //     this.properties = result.data;  
    //   }
    //   this.pagination = result.pagination;
    //   this.message = null;

    //   if(this.properties.length == this.pagination.total){
    //     this.settings.loadMore.complete = true;
    //     this.settings.loadMore.result = this.properties.length;
    //   }
    //   else{
    //     this.settings.loadMore.complete = false;
    //   }
    // })
  }

  public resetLoadMore() {
    this.settings.loadMore.complete = false;
    this.settings.loadMore.start = false;
    this.settings.loadMore.page = 1;
    this.pagination = new Pagination(1, this.count, null, null, this.pagination.total, this.pagination.totalPages);
  }

  public filterData(data) {
    return this.appService.filterData(data, this.searchFields, this.sort, this.pagination.page, this.pagination.perPage);
  }

  public searchClicked() {
    this.properties.length = 0;
    this.getProperties();
  }
  public searchChanged(event) {
    event.valueChanges.subscribe(() => {
      this.resetLoadMore();
      this.searchFields = event.value;
      setTimeout(() => {
        this.removedSearchField = null;
      });
      if (!this.settings.searchOnBtnClick) {
        this.properties.length = 0;
      }
    });
    event.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      if (!this.settings.searchOnBtnClick) {
        this.getProperties();
      }
    });
  }
  public removeSearchField(field) {
    this.message = null;
    this.removedSearchField = field;
  }



  public changeCount(count) {
    this.count = count;
    this.resetLoadMore();
    this.properties.length = 0;
    this.getProperties();

  }
  public changeSorting(sort) {
    this.sort = sort;
    this.resetLoadMore();
    this.properties.length = 0;
    this.getProperties();
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public getFeaturedProperties() {
    this.appService.getFeaturedProperties().subscribe(properties => {
      this.featuredProperties = properties;
    })
  }



  public UpdateContact() {




    console.log("Function Called")
    return this.MyHttp.get("http://localhost:3000/").subscribe(DBinfo => this.ContactInfo = DBinfo,
      err => console.log(err),
      () => console.table(this.ContactInfo));


  }


}
