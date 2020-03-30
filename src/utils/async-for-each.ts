export async function asyncForEach(array: Array<any>, callback: (item: any, index?: number, array?: Array<any>) => void) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
