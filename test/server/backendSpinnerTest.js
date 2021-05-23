
import {test} from '../testServer.js';
import {TestSuite} from "../testClasses.js";
import {spin, calcVelocity, calcWaitTimes} from "../../scripts/backendSpinner.js";

const testSuite = new TestSuite('backendSpinner.js');

const rotationAngle = 1231;
const refine = 20;
const rotationTime = 4;

const calcVelocityExpectedOutput = {
    max : 10.7425,
    min: 0.5371,
    repositioning : 3,
    sessions : [10.7425, 10.2054, 9.6683, 9.1311, 8.594,
                8.0569, 7.5198, 6.9826, 6.4455, 5.9084,
                5.3712, 4.8341, 4.2970, 3.7599, 3.2228,
                2.6856, 2.1485, 1.6114, 1.0742, 0.5371]
};

testSuite.addFunctionTest(calcVelocity, [rotationAngle, rotationTime, refine], calcVelocityExpectedOutput);


const userPos = {
    'User1' : {top : 594, left : 601},
    'User2' : {top : 338, left : 562},
    'User3' : {top : 322, left : 794},
    'User4' : {top : 499, left : 906},
    'User5' : {top : 613, left : 777}
};
const spinnerPos = {top : 500, left : 750}
const range = 250;
const rot = 1254;

const spinExpectedOutput = {
    winner : 'User2',
    rotationAngle: 1254.0000,
    userAngles: {
        'User1' : 105.6703,
        'User2' : 232.0492,
        'User3' : 321.3170,
        'User5' : 51.9394
    }
}

testSuite.addFunctionTest(spin,[userPos, spinnerPos, range, rot], spinExpectedOutput);

const velocity = {
    max : 10.7425,
    min: 0.5371,
    repositioning : 3,
    sessions : [10.7425, 10.2054, 9.6683, 9.1311, 8.594,
                8.0569, 7.5198, 6.9826, 6.4455, 5.9084,
                5.3713, 4.8341, 4.2970, 3.7599, 3.2227,
                2.6856, 2.1485, 1.6114, 1.0742, 0.5371]
};
const stillTime = 200;

const calcWaitTimesExpectedOutput = {
    sessions : [0, 99.1064, 203.4287, 313.5464, 430.1425,
                554.0255, 686.167, 827.7467, 980.2187, 1145.3961,
                1325.5888, 1523.7998, 1744.0375, 1991.8036, 2274.9630,
                2605.3229, 3001.7523, 3497.2845, 4157.9838, 5149.0942],
    repositioning : 7331.3151,
    reset : 2600,
    total : 9931.3151
};

testSuite.addFunctionTest(calcWaitTimes,[velocity, refine, rotationAngle, stillTime], calcWaitTimesExpectedOutput);

export function backendSpinnerTest(){
    test.addSuite(testSuite);
}