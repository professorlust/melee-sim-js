﻿define(function () {
    // Start with the constructor
    function Armor(name, hitsStopped, maAdj, dxAdj) {
        this.name = name;
        this.hitsStopped = hitsStopped;
        this.maAdj = maAdj;
        this.dxAdj = dxAdj;
    }

    // Now add methods
    Armor.prototype.getName = function () {
        return this.name;
    };
    
    Armor.prototype.hitsStopped = function() {
        return this.hitsStopped;
    }

    Armor.prototype.getDexAdjustment = function() {
        return this.dxAdj;
    }

    Armor.prototype.toString = function () {
        return this.name + " (" + this.hitsStopped + ")";
    }

    Armor.NO_ARMOR = new Armor("No armor", 0, 0, 0); 
    Armor.LEATHER = new Armor("Leather", 2, 2, 2);
    Armor.CHAIN = new Armor("Chain", 3, 4, 4); 
    Armor.PLATE = new Armor("Plate", 5, 6, 6); 
    
    // And now return the constructor function
    return Armor;
});

