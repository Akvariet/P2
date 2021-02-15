
//The current positions of users in px
const userpos = [
    {top: 266, left: 216},
    {top: 218, left: 581},
    {top: 559, left: 627},
    {top: 469, left: 249}
];

const s_pos = {top: 336, left: 312};

const getRelUserPos = ()=> {
    const res = [];
    userpos.forEach(value => res.push({
        top:  value.top  - s_pos.top,
        left: value.left - s_pos.left
    }));
    return res;
}


function closestUser(userPositions, fwd){
    const relPos = getRelUserPos();

    const op = x => fwd.scale(x);

    const up = x => fwd.ortho().scale(x) + b;

    const dist = [];

    relPos.forEach(value => {
        const a = fwd.ortho().slope();
    });




}



