import assert from 'assert';

export class Test {
    suites = [];

    // Called when the user creates a new test.
    constructor() {

    }

    addSuite(suite){
        this.suites.push(suite);
    }

    test(){
        for (const suite of this.suites) {
            suite.run()
        }
    }
}

export class TestSuite{
    // How many decimals of precision is needed?
    precision = 4;
    fails = [];
    suiteName;
    tests = [];
    warnings = [];

    constructor(name) {
        this.suiteName = name;
    }

    // Takes an array of inputs, and an output. The of output of func given the input must be equal to output.
    // If the output of the function is an object or array, this will test if the object is reference equal to the expected output.
    addFunctionTest(func, input, output){
        this.tests.push(() => this.test(func, input, output));
    }

    addEventTest(input, expectedOutput){
        this.tests.push(() => this.eventTest(input, expectedOutput));
    }

    async test(func, input, output) {
        // Test the function, if the test fails it will throw an assertion error.
        Promise.resolve(func(...input))
            .then(result => {
                if(typeof result === 'number' && typeof output === 'number'){
                    result = Number(result.toFixed(this.precision));
                    output = Number(output.toFixed(this.precision))
                }

                try {
                    assert.deepStrictEqual(result, output);
                }
                catch (err){
                    throw testFailed(func.name, this.suiteName, input, err.actual, output)
                }
            })
    }

    eventTest(input, expectedOutput){
        const expectedEvents = Object.keys(expectedOutput);

        expectedEvents.forEach(event => {
            try{
                assert.deepStrictEqual(input[event], expectedOutput[event]);
            }
            catch (err){
                throw eventTestFailed(event, this.suiteName, err.actual, expectedOutput[event]);
            }
        });
    }

    run(){
        this.tests.forEach(test => test());
    }

}

function testFailed(functionName, suiteName, input, output, expected){
    return functionName + ' has failed in ' + suiteName + '!\n' +
        'Received input : ' + JSON.stringify(input)  + '\n' +
        'Got output     : ' + JSON.stringify(output) + '\n' +
        'Expected output: ' + JSON.stringify(expected);
}

function eventTestFailed(eventName, suiteName, input, expected){
    return eventName + ' has failed ' + suiteName + '!\n' +
        'Received output: ' + JSON.stringify(input)  + '\n' +
        'Expected output: ' + JSON.stringify(expected);
}