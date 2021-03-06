﻿importScripts('../lib/require.js');

require(["./HeroesSingleton", "./Hero", "./Game", "./controller", "./Logger"], function (HeroesSingleton, Hero, Game, controller, Logger) {
    "use strict";

    var poleWeaponsChargeFirstRound = null;
    var defendVsPoleCharge = null;

    self.postMessage({ "cmd": "worker started" });

    self.addEventListener('message', function (event) {
        /**
         * Only one type of message to start this thread
         */
        var data = event.data;
        var heroSet = [];  // list of heroes to fight

        Game.createHeroesMap();
        var completeHeroMap = Game.getHeroMap();
        data.selectedHeroes.forEach(function (heroName) {
            var hero = completeHeroMap[heroName];
            heroSet.push(hero);
        }, this);

        /**
         * Configure simulator options
         */
        Logger.setMute(!data.isVerbose);
        poleWeaponsChargeFirstRound = data.isPoleWeaponsChargeFirstRound;
        defendVsPoleCharge = data.isDefendVsPoleCharge;

        tryAllCombinations(heroSet, data.boutCount);
    });

    function tryAllCombinations(heroSet, boutCount) {
        var matchupWins = {};  // map of hero and integer
        var heroWins = {};
        var game = null;
        var score = [2];
        var progress = 0;
        // how many bouts total is N * N-1 * boutCount
        var totalIterations = heroSet.length * (heroSet.length - 1) * boutCount / 2;
        var iterationCount = 0;
        heroSet.forEach(function (hero1) {
            heroWins[hero1.getName()] = 0;
            heroSet.forEach(function (hero2) {
                if (hero1 !== hero2) matchupWins[hero1.getName() + "/" + hero2.getName()] = 0;
            });
        });
        var lastUpdateTime = new Date(); // for throttling updates
        //console.log(heroWins);

        for (var h1 = 0; h1 < heroSet.length; h1++) {
            var hero1 = heroSet[h1];
            var h2 = 0;
            var hero2 = heroSet[h2];

            for (h2 = h1 + 1; h2 < heroSet.length; h2++) {
                hero2 = heroSet[h2];
                var sumRounds = 0;
                score[0] = 0;
                score[1] = 0;
                Logger.log('Matchup: ' + hero1.getName() + ' vs. ' + hero2.getName());

                for (var bout = 0; bout < boutCount; bout++) {
                    Logger.log("Bout: " + bout + 1 + " of " + boutCount);
                    iterationCount++;
                    /**
                     * Don't post updates too often
                     */
                    var currentTime = new Date();
                    if (currentTime.getTime() - lastUpdateTime.getTime() > 200) {
                       /**
                        * update progress bar on page (assumes max is 10000)
                        */
                        progress = Math.ceil((iterationCount / totalIterations) * 100 * 100);
                        self.postMessage({ "cmd": "progressUpdate", "progress": progress });
                        lastUpdateTime = currentTime;
                    }

                    // clone heroes (resets them) prior to fighting
                    var fightingHero1 = Object.create(hero1);
                    var fightingHero2 = Object.create(hero2);
                    // console.log(fightingHero1);
                    // console.log(fightingHero2);
                    game = new Game(fightingHero1, fightingHero2, poleWeaponsChargeFirstRound, defendVsPoleCharge);
                    var winningFighter = game.fightToTheDeath();

                    if (winningFighter !== null) {
                        var losingFighter = (winningFighter === fightingHero1 ? fightingHero2 : fightingHero1);
                        score[(winningFighter === fightingHero1 ? 0 : 1)]++;
                        matchupWins[winningFighter.getName() + "/" + losingFighter.getName()]++;
                    }
                    sumRounds += game.round;
                }
                /**
                 * Update the total stats for these heroes
                 */
                heroWins[hero1.getName()] += score[0];
                heroWins[hero2.getName()] += score[1];
            }

        }
        /**
         * Put stats back on page
         */
        self.postMessage({ "cmd": "finished", "heroWins": heroWins, "matchupWins": matchupWins });
    }

});
