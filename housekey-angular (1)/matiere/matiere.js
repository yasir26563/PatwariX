var db = require('../db');

var Matiere = {
    getmatieres: function(callback)
    {
        return db.query('SELECT * from marketplace', callback);
    },
    creatematiere: function (Matiere, callback) {
        return db.query("Insert into marketplace(Serial No.,Picture,Name,PlotSize,Price,PropertyID) values(24,'pic','DHA2', 2400,1400,12)",[Matiere.Name, Matiere.Price], callback);
    }
}

module.exports = Matiere;
