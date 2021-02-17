
//The current positions of users in px (Use these for debugging and test.
const userpos = [
    {top: 266, left: 216},
    {top: 218, left: 581},
    {top: 559, left: 627},
    {top: 469, left: 249}
];

//The position of the spinner.
const s_pos = {top: 336, left: 312};

export function spin(userPos){

    // Pass this to the front end to run the spinner locally.
    const rot = Math.random() * 360;

    //return the result of the spin.
    return closestUser(userPos, rot);

    //--- Helper functions ---\\
    //Find the user which is closest to being pointed at. Pass this function so the front end can play along.
    function closestUser(userPositions, rotDeg){
        const relPos = getRelUserPos();

        const rots = [];

        //Check the angles between all the users in the game.
        relPos.forEach(value => {
            let a = Math.atan(value.top / value.left) * 180 / Math.PI;

            if (value.left < 0)
                a = 180 + a

            //add the difference in degrees to rots.
            rots.push(Math.abs(a-rotDeg));
        });

        //Return the index of the lowest angle.
        return rots.indexOf(Math.min(...rots));

        //Returns the position of the players in relation to the spinner.
        function getRelUserPos() {
            const res = [];

            userpos.forEach(value => res.push({
                top:  value.top  - s_pos.top,
                left: value.left - s_pos.left
            }));

            return res;
        }

    }
}



