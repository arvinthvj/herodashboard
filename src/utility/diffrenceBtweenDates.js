export const DiffrenceInYear = (dt1, dt2) => {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60 * 24);
    return Math.abs(diff / 365.25);

}

export const DiffrenceInDays = (dt1, dt2) => {
    let timeDiff = dt1.getTime() - dt2.getTime();
    return (timeDiff / (1000 * 3600 * 24));
}

