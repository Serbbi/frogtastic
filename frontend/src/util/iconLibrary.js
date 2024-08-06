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
    , faPlus
    , faScrewdriverWrench
    , faFrog
    , faUpload
    , faList
    , faGear
    , faBuilding
    , faRightFromBracket
    , faComment
    , faBuildingCircleArrowRight
    , faBell
    , faChevronDown
    , faBars
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
        faSquareCheck,
        faGear,
        faBuilding,
        faPlus,
        faScrewdriverWrench,
        faFrog,
        faUpload,
        faList,
        faRightFromBracket,
        faComment,
        faBuildingCircleArrowRight,
        faBell,
        faChevronDown,
        faBars);
}