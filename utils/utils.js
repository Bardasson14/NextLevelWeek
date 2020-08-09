function convertToMinutes(time) {
    [hours, mins] = time.split(':');
    return parseInt(hours * 60 + mins);
}

module.exports = convertToMinutes;