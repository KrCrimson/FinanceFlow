import '@testing-library/jest-dom';
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
  };
});
