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
    suiteName;
    tests = [];
    fails = [];
    warnings = [];

    constructor(name) {
        this.suiteName = name;
    }

    // Takes an array of inputs, and an output. The of output of func given the input must be equal to output.
    // If the output of the function is an object or array, this will test if the object is reference equal to the expected output.
    addFunctionTest(func, input, output){
        this.tests.push(() => this.test(func, input, output));
    }

    addClassMethodTest(instance, method, input, output){
        method.bind(instance);
        this.tests.push(() => this.test(method, input, output));
    }

    test(func, input, output)
    {
        if (typeof output === 'object')
            this.warnings.push(`Warning: Expected output of ${func.name} is of type object. The test will check if the objects are reference equal.`);

        // Test the function, if the test fails it will throw an assertion error.
        try {
            this.evaluate(func(...input), output)
        } catch (err) {
            if (!(err instanceof assert.AssertionError)) console.error(err);

            // If e is an assertion error, the test has failed.
            this.fails.push(
                `${func.name} has failed in ${this.suiteName}!\nReceived input : ${JSON.stringify(input)}\nGot output     : ${JSON.stringify(err.actual)}\nExpected output: ${JSON.stringify(output)}\n`
            );

        }
    }
    evaluate(result, expectedOutput){
        if(typeof result === 'number' && typeof expectedOutput === 'number'){
            result = Number(result.toFixed(this.precision));
            expectedOutput = Number(expectedOutput.toFixed(this.precision))
        }
        assert.strictEqual(result, expectedOutput);
    }

    run(){
        this.fails = [];
        this.tests.forEach(test => test())
        this.showResults();
    }

    showResults() {
        const tests = this.tests.length;
        const fails = this.fails.length;
        const warnings = this.warnings.length;
        const status = `Completed ${tests} test${tests===1? '' : 's'} in ${this.suiteName} with ${fails} error${fails===1? '' : 's'} and ${warnings} warning${warnings===1? '' : 's'}${fails + warnings? '!' : '.'}`

        console.log(status);

        if (fails) console.log('**** Fails ****')
        for (const fail of this.fails) {
            console.error(fail);
        }
        if(warnings) console.log('**** Warnings ****')
        for (const warning of this.warnings) {
            console.warn(warning)
        }
    }
}