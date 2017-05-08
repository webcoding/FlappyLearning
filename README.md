# Flappy Learning ([Demo](http://xviniette.github.io/FlappyLearning/))

Program that learns to play Flappy Bird by machine learning ([Neuroevolution](http://www.scholarpedia.org/article/Neuroevolution))

![alt tag](https://github.com/xviniette/FlappyLearning/blob/gh-pages/img/flappy.png?raw=true)

### [NeuroEvolution.js](http://github.com/xviniette/FlappyLearning/blob/gh-pages/Neuroevolution.js) : Utilization
```javascript
// Initialize
var ne = new Neuroevolution({options});

// Default options values
var options = {
    network: [1, [1], 1],    // Perceptron structure
    population: 50,          // Population by generation
    elitism: 0.2,            // Best networks kepts unchanged for the next generation (rate)
    randomBehaviour: 0.2,    // New random networks for the next generation (rate)
    mutationRate: 0.1,       // Mutation rate on the weights of synapses
    mutationRange: 0.5,      // Interval of the mutation changes on the synapse weight
    historic: 0,             // Latest generations saved
    lowHistoric: false,      // Only save score (not the network)
    scoreSort: -1,           // Sort order (-1 = desc, 1 = asc)
    nbChild: 1               // number of child by breeding
}

//Update options at any time
ne.set({options});

// Generate first or next generation
var generation = ne.nextGeneration();

//When an network is over -> save this score
ne.networkScore(generation[x], <score = 0>);
```

You can see the NeuroEvolution integration in Flappy Bird in [Game.js](http://github.com/xviniette/FlappyLearning/blob/gh-pages/game.js).

## How it works

As far as I learned from code it takes 2 inputs:

normalized vertical position of the bird (Y coordinate divided by canvas height)
normalized vertical position of next gap between pipes (Y coordinate of the bottom edge of top pipe / canvas height)
It doesn't care about bottom pipe and the gap size, and horizontal distance to next gap.

In terms of the game the bird instantly falling down with acceleration (like normal gravity effect), and moving up is supposed to be done by hitting ceretain key on keyboard (e.g. Up or Space) and it looks like jump from the current position of the bird.
It's also possible to hold the key pressed and bird will go up with constant speed and upon releasing the key bird performs additional jump.

We have 1 output here - floating number from 0 to 1. If it is greater than 0.5 we assume that bird needs to go up, so it translates it as pressing (or keep holding) UP key, otherwise - releasing the key.
