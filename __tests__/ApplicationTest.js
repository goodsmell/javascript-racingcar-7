import { MissionUtils } from '@woowacourse/mission-utils';
import { getUserInput, printRacingState } from '../src/views/View.js';
import {
  divisionCarName,
  createCarObject,
  shouldMoveForward,
  getCarPositionsRepresentation,
  findWinners,
} from '../src/models/Model.js';
import App from '../src/App.js';

const mockQuestions = (inputs) => {
  MissionUtils.Console.readLineAsync = jest.fn();

  MissionUtils.Console.readLineAsync.mockImplementation(() => {
    const input = inputs.shift();
    return Promise.resolve(input);
  });
};

const mockRandoms = (numbers) => {
  MissionUtils.Random.pickNumberInRange = jest.fn();

  numbers.reduce(
    (acc, number) => acc.mockReturnValueOnce(number),
    MissionUtils.Random.pickNumberInRange,
  );
};

const getLogSpy = () => {
  const logSpy = jest.spyOn(MissionUtils.Console, 'print');
  logSpy.mockClear();
  return logSpy;
};

describe('자동차 경주', () => {
  test('기능 테스트', async () => {
    // given
    const MOVING_FORWARD = 4;
    const STOP = 3;
    const inputs = ['pobi,woni', '1'];
    const logs = ['pobi : -', 'woni : ', '최종 우승자 : pobi'];
    const logSpy = getLogSpy();

    mockQuestions(inputs);
    mockRandoms([MOVING_FORWARD, STOP]);

    // when
    const app = new App();
    await app.run();

    // then
    logs.forEach((log) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(log));
    });
  });

  test('예외 테스트', async () => {
    // given
    const inputs = ['pobi,javaji'];
    mockQuestions(inputs);

    // when
    const app = new App();

    // then
    await expect(app.run()).rejects.toThrow('[ERROR]');
  });
});

// ------커스텀 테스트-----

const CAR_NAMES_STRING = 'happy,car';
const CAR_NAMES_ARRAY = ['happy', 'car'];
const CAR_OBJECTS = { names: ['happy', 'car'], positions: [0, 0] };
const CAR_MOVES = { names: ['happy', 'car'], positions: [1, 0] };

const testCar = (description, fn, input, expectedOutput) => {
  test(description, () => {
    const result = fn(input);
    expect(result).toEqual(expectedOutput);
  });
};

describe('Custom Test', () => {
  test('사용자 입력 확인', async () => {
    const consoleSpy = jest
      .spyOn(MissionUtils.Console, 'readLineAsync')
      .mockImplementation(() => Promise.resolve(CAR_NAMES_STRING));
    const input = await getUserInput();
    expect(input).toBe(CAR_NAMES_STRING);
    consoleSpy.mockRestore();
  });

  testCar(
    '사용자가 입력한 차 쉼표로 구분',
    divisionCarName,
    CAR_NAMES_STRING,
    CAR_NAMES_ARRAY,
  );

  // createCarObject 테스트
  testCar('자동차 객체 생성', createCarObject, CAR_NAMES_ARRAY, CAR_OBJECTS);

  test('랜덤 값을 이용해 자동차의 전진 수를 올바르게 업데이트하는지 확인', () => {
    const randomSpy = jest.spyOn(MissionUtils.Random, 'pickNumberInRange');
    randomSpy.mockImplementationOnce(() => 4).mockImplementationOnce(() => 3);
    expect(shouldMoveForward(CAR_OBJECTS)).toEqual(CAR_MOVES);

    randomSpy.mockRestore();
  });

  // -로 전진 표시 테스트
  test('move 수 만큼 -로 변환', () => {
    const expectedOutput = ['happy : -', 'car : '];
    expect(getCarPositionsRepresentation(CAR_MOVES)).toEqual(expectedOutput);
  });

  test('현재 게임 상태 출력', () => {
    const carData = ['car1 : --', 'car2 : ---'];
    const logSpy = getLogSpy();
    printRacingState(carData);
    // 첫 번째 라인 출력 검증
    expect(logSpy).toHaveBeenCalledWith('car1 : --');
    // 두 번째 라인 출력 검증
    expect(logSpy).toHaveBeenCalledWith('car2 : ---');
    // 빈 줄 출력 검증
    expect(logSpy).toHaveBeenCalledWith('');
  });

  test.each([
    // [자동차 데이터, 기대 값]
    [{ names: ['happy', 'car', 'fast'], positions: [5, 3, 2] }, ['happy']],
    [
      { names: ['happy', 'car', 'fast'], positions: [5, 5, 2] },
      ['happy', 'car'],
    ],
    [
      { names: ['one', 'two', 'three'], positions: [1, 1, 1] },
      ['one', 'two', 'three'],
    ],
  ])('우승자 찾기', (carData, expectedWinners) => {
    expect(findWinners(carData)).toEqual(expectedWinners);
  });
});
