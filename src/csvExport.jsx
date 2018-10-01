import json2csv from 'json2csv';
import fileSaver from 'file-saver';

/**
 * Check if we are able to user the DOM
 *
 * @returns {boolean} True if we can use the DOM.
 */
export const canUseDOM = () => typeof window !== 'undefined' && typeof window.document !== 'undefined';

/**
 * Export data to a csv file
 *
 * @param {array} fields An array of field names.
 * @param {array} data An array of objects containing field value pairs.
 * @param {string} filename The name of the file to be created.
 */
export const exportToCSVFile = (fields, data, filename) => {
  const Json2csvParser = json2csv.Parser;
  const json2csvParser = new Json2csvParser({ fields });
  const csv = json2csvParser.parse(data);

  const { saveAs } = fileSaver;
  saveAs(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }), filename, true);
};
