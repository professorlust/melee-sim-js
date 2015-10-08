﻿define(["./Hero", "./Weapon", "./Armor", "./Shield"], function (Hero, Weapon, Armor, Shield) {

    return {
        listHeight : 20,
        createHeroesList: function () {
            console.log("creating Heroes list...")
            // heroSet.put(new Hero("001:ST8;DX16;DAGGER;NO_ARMOR;SMALL_SHIELD", 8, 16, Weapon.DAGGER, Armor.NO_ARMOR, Shield.SMALL_SHIELD), new Integer(0));
            var h1;
            h1 = new Hero("001:ST8;DX16;DAGGER;NO_ARMOR;SMALL_SHIELD", 8, 16, Weapon.DAGGER, Armor.NO_ARMOR, Shield.SMALL_SHIELD);
            this.addHero(h1.getName());
            h1 = new Hero("002:ST8;DX16;DAGGER;LEATHER;SMALL_SHIELD", 8, 16, Weapon.DAGGER, Armor.LEATHER, Shield.SMALL_SHIELD);
            this.addHero(h1.getName());
        },
        addHero: function(name) {
            var select = document.getElementById("heroesSelected");
            var opt = document.createElement('option');
            opt.value = name;
            opt.innerHTML = name;
            select.appendChild(opt);
        }
    }
});