
// s_pos is the position of the spinner.
export default function spin(userPos, s_pos){

    // Pass this to the front end to run the spinner locally.
    const rot = Math.random() * 360*5;

    const result = closestUser(userPos, rot);

    //return the result of the spin and the rotation of the spinner. Players should not move before the game is done.
    return {winner: result, rot: rot};

    //--- Helper functions ---\\
    //Find the user which is closest to being pointed at. Pass this function so the front end can play along.
    function closestUser(userPositions, rotDeg){
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




