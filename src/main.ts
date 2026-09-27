import './styles/main.css';
import { App } from './App';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  if (root) {
    (window as any).__app = new App(root);
  }
});
