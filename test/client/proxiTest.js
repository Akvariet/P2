import {TestSuite} from '../testClasses.js';
import {test} from '../testServer.js';
import {distance} from '../../public/js/proxi.js';

// Test Data
const point =
    {top : -7.96,
     left: 1.78};

const points = [
    {top : 3.66,
     left: -2.1},

    {top : 4.76,
     left: 2.78},

    {top : -3.7,
     left: -3.16},

    {top : -3.06,
     left: 3.72},

    {top : 0.84,
     left: -1.82},

    {top : 1,
     left: 3}
 ];

const expectedOutput = [
        12.2507,
        12.7592,
        6.5231,
        5.2701,
        9.5079,
        9.0427
];

const testSuite = new TestSuite('proxi.js');

for (let i = 0; i < points.length; i++) {
    testSuite.addFunctionTest(distance,[point, points[i]], expectedOutput[i]);
}

export function proxiTest(){
    test.addSuite(testSuite);
}

