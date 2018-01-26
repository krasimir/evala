import { Machine } from 'stent';
import { StentEmitter, ReactEmitter } from 'kuker-emitters';

Machine.addMiddleware(StentEmitter());
ReactEmitter();
