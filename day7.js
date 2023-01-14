const fs = require('fs');

class File {
  constructor(filename, size) {
    this.filename = filename;
    this.size = size;
  }

  toString() {
    return `${this.filename} ${this.size}`;
  }
}

class Folder {
  constructor(dirname) {
    this.prev;
    this.dirname = dirname;
    this.folders = []; // Folder[]
    this.files = [];  // [ {filename: string, size: number}]
  }

  get size() {
    let _size = 0;
    for (let file of this.files) {
      _size += file.size;
    }

    for (let folder of this.folders) {
      _size += folder.size;
    }

    return _size;
  }

  toString() {
    return this.dirname;
  }
}

const day7a = () => {
  let answer = 0;

  // const filename = './data/day7test.txt';
  const filename = './data/day7.txt';
  const instructions = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  const root = new Folder('/');
  const allFolders = [root];

  let ptr = root;
  while (instructions.length > 0) {
    const line = instructions.shift();
    if (line.includes('$ cd')) {
      const [_a, _b, dir] = line.split(' ');
      if (dir === '..') {
        ptr = ptr.prev;
      } else {
        if (dir === '/') {
          ptr = root;
        } else {
          ptr = ptr.folders.find(f => f.dirname === dir);
        }
      }
      // console.log(`goto directory ${ptr.prev?.dirname}/${ptr.dirname}`, ptr.dirname);
    } else if (line.includes('$ ls')) {
      // do nothing.
    } else {
      const arr = line.split(' ');
      if (arr[0] === 'dir') {
        const newFolder = new Folder(arr[1]);
        newFolder.prev = ptr;
        ptr.folders.push(newFolder);
        // console.log(`create new folder ${ptr.dirname}/${newFolder.dirname}`)
        allFolders.push(newFolder);
      } else {
        const newFile = new File(arr[1], +arr[0]);
        // console.log(`create new file ${ptr.dirname}/${newFile}`);
        ptr.files.push(newFile);
      }
    }
  }

  allFolders.forEach(folder => {
    // console.log(folder.dirname, folder.size)
    if (folder.size <= 100000) answer += folder.size;
  });

  console.log('day7a answer = ', answer);  // 1072909, 115637 too low
}

const day7b = () => {
  let answer = 0;

  // const filename = './data/day7test.txt';
  const filename = './data/day7.txt';
  const instructions = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  const root = new Folder('/');
  const allFolders = [root];

  let ptr = root;
  while (instructions.length > 0) {
    const line = instructions.shift();
    if (line.includes('$ cd')) {
      const [_a, _b, dir] = line.split(' ');
      if (dir === '..') {
        ptr = ptr.prev;
      } else {
        if (dir === '/') {
          ptr = root;
        } else {
          ptr = ptr.folders.find(f => f.dirname === dir);
        }
      }
      // console.log(`goto directory ${ptr.prev?.dirname}/${ptr.dirname}`, ptr.dirname);
    } else if (line.includes('$ ls')) {
      // do nothing.
    } else {
      const arr = line.split(' ');
      if (arr[0] === 'dir') {
        const newFolder = new Folder(arr[1]);
        newFolder.prev = ptr;
        ptr.folders.push(newFolder);
        // console.log(`create new folder ${ptr.dirname}/${newFolder.dirname}`)
        allFolders.push(newFolder);
      } else {
        const newFile = new File(arr[1], +arr[0]);
        // console.log(`create new file ${ptr.dirname}/${newFile}`);
        ptr.files.push(newFile);
      }
    }
  }

  // The total disk space available to the filesystem is 70000000. To run the update, you need unused space of at least 30000000. You need to find a directory you can delete that will free up enough space to run the update.

  let currentSize = root.size;
  const sortedFolders = allFolders.sort((a, b) => a.size - b.size);
  const neededSpace = 30000000 - (70000000-currentSize);
  // console.log(currentSize,  70000000-currentSize, neededSpace);

  for (let folder of sortedFolders) {
    // console.log(folder.size, folder.dirname);
    if (folder.size >= neededSpace) {
      console.log('day7b answer = ', folder.size);
      break;
    }
  }  
}

module.exports = { day7a, day7b };