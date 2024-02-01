import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

export function initializeIcons() {
    library.add(faCircleQuestion, faArrowLeft, faAngleRight, faAngleLeft);
}