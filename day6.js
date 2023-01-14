const fs = require('fs');

const day6a = () => {

  const findStartMarker = (line) => {
    let answer = 0;
    const GIVEUP = 9999;
    const STACKSIZE = 4;
    let idx = STACKSIZE;
    const buffer = line.slice(0, STACKSIZE).split('');

    while (idx < GIVEUP) {
      const bufferSet = new Set(buffer);
      // console.log(buffer, bufferSet.size);
      if (bufferSet.size === STACKSIZE) {
        return idx;
      }
      buffer.shift();
      buffer.push(line[idx]);
      idx += 1;
    }

    return GIVEUP;
  }

  // const lines = ["bvwbjplbgvbhsrlpgdmjqwftvncz", /*: first marker aftercharacter 5 */
  //   "nppdvjthqldpwncqszvftbrmjlhg", /*: first marker after character 6*/
  //   "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", /*: first marker after character 10*/
  //   "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"] /*: first marker after character 11*/

  // lines.forEach(line => {
  //   const idx = findStartMarker(line);
  //   console.log(idx);
  // });

  const filename = './data/day6.txt';
  const line = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' });

  answer = findStartMarker(line);

  console.log('day6a answer = ', answer);
}

const day6b = () => {
  const findStartMarker14 = (line) => {
    let answer = 0;
    const GIVEUP = 9999;
    const STACKSIZE = 14;
    let idx = STACKSIZE;
    const buffer = line.slice(0, STACKSIZE).split('');

    while (idx < GIVEUP) {
      const bufferSet = new Set(buffer);
      if (bufferSet.size === STACKSIZE) {
        return idx;
      }
      buffer.shift();
      buffer.push(line[idx]);
      idx += 1;
    }

    return GIVEUP;
  }

  // const lines = ["bvwbjplbgvbhsrlpgdmjqwftvncz", /*: first marker aftercharacter 23 */
  //   "nppdvjthqldpwncqszvftbrmjlhg", /*: first marker after character 23*/
  //   "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", /*: first marker after character 29*/
  //   "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"] /*: first marker after character 26*/

  // lines.forEach(line => {
  //   const idx = findStartMarker14(line);
  //   console.log(idx);
  // });

  const filename = './data/day6.txt';
  const line = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' });

  answer = findStartMarker14(line);

  console.log('day6b answer = ', answer)

}

module.exports = { day6a, day6b };