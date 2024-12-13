import { MissionUtils } from '@woowacourse/mission-utils';

class InputManager {
  static async input(messages) {
    const input = await MissionUtils.Console.readLineAsync(messages);
    return input;
  }
}

export default InputManager;
