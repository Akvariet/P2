
import {Test} from './testClasses.js';
import {proxiTest} from './client/proxiTest.js';

import {colorPickerTest} from "./server/colorPickerTest.js";

export const test = new Test();

proxiTest();
colorPickerTest();

test.test();

