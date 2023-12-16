const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/alesiagamesw.js", {
        scope: "/",
      });
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

registerServiceWorker();

class AlesiaGame {
  openedBlock = null;

  constructor() {
    this.fieldElement = document.querySelector('.field');
    this.fieldElement.classList.add('hidden');
    return this;
  }

  initGame = () => {
    this.numbers = [];
    this.fieldElement.innerHTML = '';
    document.querySelector('.salut').classList.add('hidden');
    const blocksInColumn = +document.querySelector('.select-rows').value || 2;
    const blocksInRow = +document.querySelector('.select-columns').value || 3;
    this.fieldElement.classList.remove('hidden');
    for (let number = 0; number < blocksInRow * blocksInColumn / 2; number++) {
      this.numbers.push(number, number);
    }
    for (let row = 0; row < blocksInColumn; row++) {
      const newRow = document.createElement('div');
      newRow.classList.add('row');
      this.fieldElement.appendChild(newRow);
      for (let column = 0; column < blocksInRow; column++) {
        const blockElement = this.createBlockElement(this.getRandomNumber(this.numbers));
        newRow.appendChild(blockElement);
      }
    }
    this.numberOfBlocks = document.querySelectorAll('.block').length;
    this.setListener();
  }

  setListener = () => this.fieldElement.addEventListener('mouseup', this.onBlockClick);
  removeListener = () => this.fieldElement.removeEventListener('mouseup', this.onBlockClick);

  onBlockClick = ({target}) => {
    if (this.isOpened(target) || this.openedBlock === target || target.classList.contains('row')) {
      return;
    }
    this.removeListener();
    if (!this.openedBlock) {
      this.open(target);
      this.openedBlock = target;
      this.setListener();
      return;
    }
    if (this.openedBlock.innerText === target.innerText) {
      this.open(target);
      this.openedBlock = null;
      this.setListener();
      this.checkIfAllOpened();
      return;
    }
    this.setError(target);
    this.setError(this.openedBlock);
    setTimeout(() => {
      this.hide(target);
      this.hide(this.openedBlock);
      this.openedBlock = null;
      this.setListener();
    }, 500);
  }

  checkIfAllOpened() {
    const numberOfOpenedBlocks = document.querySelectorAll('.opened').length;
    if (this.numberOfBlocks === numberOfOpenedBlocks) {
      document.querySelector('.salut').classList.remove('hidden');
      this.removeListener();
    }
  }

  getRandomNumber(numbers) {
    const randomBlockNumber = Math.floor(Math.random() * numbers.length);
    return numbers.splice(randomBlockNumber, 1);
  }

  createBlockElement(text) {
    const block = document.createElement('div');
    block.classList.add('block');
    block.innerText = text;
    return block;
  }
  
  isOpened(block) {
    block.classList.contains('opened');
  };
  open(block) {
    block.classList.add('opened');
  }
  hide(block) {
    block.classList.remove('opened');
    block.classList.remove('error');
  };
  setError(block) {
    block.classList.add('error');
  };
  removeError(block) {
    block.classList.remove('error');
  };
}

const game = new AlesiaGame();
