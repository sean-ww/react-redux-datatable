
import { getByCurrPage, alignPage } from '../src/page';

describe('Page Functions', () => {
  let data;
  const params = [
    // [page, sizePerPage]
    [1, 10],
    [1, 25],
    [1, 30],
    [3, 30],
    [4, 30],
    [10, 10],
    [0, 10],
    [1, 10],
    [9, 10]
  ];

  describe('getByCurrPage', () => {
    beforeEach(() => {
      data = [];
      for (let i = 0; i < 100; i += 1) {
        data.push({ id: i, name: `test_name${i}` });
      }
    });

    it('should always return correct data', () => {
      params.forEach(([page, sizePerPage]) => {
        const rows = getByCurrPage(data, page, sizePerPage);
        expect(rows).toBeDefined();
        expect(Array.isArray(rows)).toBeTruthy();
        expect(rows.every(row => !!row)).toBeTruthy();
      });
    });

    it('should return empty array when data is empty', () => {
      data = [];
      params.forEach(([page, sizePerPage]) => {
        const rows = getByCurrPage(data, page, sizePerPage);
        expect(rows).toHaveLength(0);
      });
    });
  });
});
