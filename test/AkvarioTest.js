
import {Test} from './testClasses.js';
import {proxiTest} from './client/proxiTest.js';
import {colorPickerTest} from "./server/colorPickerTest.js";
import {backendSpinnerTest} from "./server/backendSpinnerTest.js";
//import {akvarioServerTest} from './server/akvarioServerTest.js';

export const test = new Test();

proxiTest();
colorPickerTest();
backendSpinnerTest()
//akvarioServerTest();

test.test();

