import request from '../utils/request';

export function login(options) {
  return request(`/api/user-center/users/login`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
    notSetUserId: true,
  });
}

