import InputManager from './views/inputManager.js';
import { INPUT_MESSAGE } from './views/contents/inputContents.js';
import { MissionUtils } from '@woowacourse/mission-utils';

class App {
  async run() {
    try {
      const name = await InputManager.input(INPUT_MESSAGE.inputName);
      const racingNum = await InputManager.input(INPUT_MESSAGE.inputRacingNum);
      MissionUtils.Console.print(name);
      MissionUtils.Console.print(racingNum);
      return name;
    } catch (error) {}
  }
}

export default App;
