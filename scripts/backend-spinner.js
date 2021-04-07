
export class Spinner {
    refine = 20;
    stillTime = 500;

    // assigns new game properties to the spinner
    newGame(userProperties) {
        this.result = this.spin(userProperties.positions, {top: 500, left: 750}); //TODO: Get the spinners positions so they arent fixed
        this.rotationAngle = this.result.rotationAngle;

        this.winner = userProperties.get(this.result.winner);

        this.rotationTime = this.calcRotationTime();
        this.resetPos = (360 - (this.result.rotationAngle % 360));

        this.velocity = this.calcVelocity();
        this.waitTime = this.calcWaitTimes();
    }

    // s_pos is the position of the spinner.
    spin(userPos, s_pos){

        // pass this to the front end to run the spinner locally.
        const minRounds = 2;
        let rot;

        do
            rot = Math.random() * 360*5;
        while(minRounds >= Math.floor(rot/360)) // spinner rotates minimum 2 rounds

        let userAngles = {};

        const result = closestUser(userPos, rot, userAngles);

        //return the result of the spin and the rotation of the spinner. Players should not move before the game is done.
        return {winner: result, rotationAngle: rot, userAngles: userAngles};

        //--- Helper functions ---\\
        //Find the user which is closest to being pointed at. Pass this function so the front end can play along.
        function closestUser(userPositions, rotDeg, userAngles){
            const relPos = getRelUserPos();

            const rots = [];
            const ids  = Object.keys(relPos);
            //Check the angles between all the users in the game.
            ids.forEach(id => {
                let a = Math.atan(relPos[id].top / relPos[id].left) * 180 / Math.PI;

                // if user is in second or third quadrant
                if (relPos[id].left < 0)
                    a = 180 + a;

                // if user is in first quadrant
                if (relPos[id].left > 0 && relPos[id].top < 0)
                    a = 360 + a;

                //calculates the degrees the user has to the rotated spinner
                let angFromRot = Math.abs(a - (rotDeg % 360))

                if (angFromRot > 180)
                    angFromRot = 360 - angFromRot;

                //adds the difference in degrees to rots.
                rots.push(angFromRot);

                //takes the angles to
                userAngles[id] = a;
            });

            //Return the index of the lowest angle.
            return ids[rots.indexOf(Math.min(...rots))];

            //Returns the position of the players in relation to the spinner.
            function getRelUserPos() {
                const res = {};

                Object.keys(userPositions).forEach(id => res[id] = ({
                    top:  userPositions[id].top  - s_pos.top,
                    left: userPositions[id].left - s_pos.left
                }));

                return res;
            }
        }
    }

    // finds the rotation time on the spinner
    calcRotationTime() {
        switch (Math.floor(this.result.rotationAngle / 360)) {
            case 2: case 3: return 4;
            case 4: case 5: return 5;
            default: return 4;
        }
    }

    // calculates the different velocities of the spinner
    calcVelocity() {
        let vMax = (2 * this.toRadians(this.rotationAngle)) / (this.rotationTime);
        let vMin = vMax/this.refine;
        let spinSessions = [vMin];

        for (let i = 1; i < this.refine; i++)
            spinSessions.push(spinSessions[i-1] + vMin);

        return {
            max : vMax,
            min : vMin,
            rePos : 3,
            sessions : spinSessions
        }
    }

    // compute an angle from degrees to radians
    toRadians(angle) {
        return angle * (Math.PI/180);
    }

    // calculates the different wait times for the setTimeouts in the spinner.
    calcWaitTimes () {
        const refine = this.refine;
        let v = this.velocity.min;
        let spinSessions = [0];

        for (let i = 1; i < this.refine; i++) {
            spinSessions.push(spinSessions[i-1] + v * Math.floor(this.rotationAngle * (1 / refine)));
            v += this.velocity.min;
        }

        let rePos = this.stillTime + spinSessions[refine-1] + this.velocity.max * Math.floor(this.rotationAngle * (1 / refine));
        let reset = 2600;

        return {sessions : spinSessions, rePos : rePos, reset : reset, total : rePos + reset};
    }
}
