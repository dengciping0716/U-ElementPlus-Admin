
import { definePostMock, resultSuccess } from '../_util';

const demoList = (keyword, count = 20) => {
  const result = {
    list: [] as any[],
  };
  for (let index = 0; index < count; index++) {
    result.list.push({
      name: `${keyword ?? ''}选项${index}`,
      id: `${index}`,
    });
  }
  return result;
};

export default definePostMock([
  {
    url: '/basic-api/select/getDemoOptions',
    method: 'GET',
    body: ({ query }) => {
      const { keyword, count } = query;
      console.log(keyword);
      return resultSuccess(demoList(keyword, count));
    },
  },
])
