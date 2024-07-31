import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faCircleQuestion
    , faArrowLeft
    , faAngleRight
    , faAngleLeft
    , faTriangleExclamation
    , faCircleCheck
    , faTrashCan
    , faCheck
    , faSquareXmark
    , faSquareCheck
} from '@fortawesome/free-solid-svg-icons';

export function initializeIcons() {
    library.add(faCircleQuestion,
        faArrowLeft,
        faAngleRight,
        faAngleLeft,
        faTriangleExclamation,
        faCircleCheck,
        faTrashCan,
        faCheck,
        faSquareXmark,
        faSquareCheck);
}