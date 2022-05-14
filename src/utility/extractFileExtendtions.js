export const extractExtention = (arr) => {
    let result = [];
    for (var i = 0; i < arr.length; i++) {
        result.push(arr[i].substr((arr[i].lastIndexOf('.'))))
    }
    return result;
}