import { isStringEmptyOrNull } from "./CommonMethods";
import {
  PROFILE_RETURN_TYPE_DRYWALL,
  PROFILE_RETURN_TYPE_HEMMED,
  PROFILE_RETURN_TYPE_MASONRY,
  PROFILE_RETURN_TYPE_MASONRY_575,
  PROFILE_RETURN_TYPE_NAIL_FLANGE,
  PROFILE_RETURN_TYPE_PLASTER_RETURN,
  PROFILE_RETURN_TYPE_RADIUS,
  PROFILE_RETURN_TYPE_SHADOW_BOX,
  PROFILE_RETURN_TYPE_SHADOW_BOX_RETURN,
} from "./ProfileConstants";

// Mapping files to load default dimensions for Profile
const profileShapeDefaults = {
  equal: {
    jambDepth: 18400,
    rabbet1: 6200,
    rabbet2: 6200,
    stop1: 2000,
    stop2: 2000,
    face1: 6400,
    face2: 6400,
  },
  unequal: {
    jambDepth: 18400,
    rabbet1: 6200,
    rabbet2: 5000,
    stop1: 2000,
    stop2: 2000,
    face1: 6400,
    face2: 6400,
  },
  single: {
    // Single Rabbet
    jambDepth: 18400,
    rabbet1: 6200,
    rabbet2: 0,
    stop1: 2000,
    stop2: 0,
    face1: 6400,
    face2: 8400,
  },
  "double-egress": {
    jambDepth: 18400,
    rabbet1: 6100,
    rabbet2: 6200,
    stop1: 2000,
    stop2: 2000,
    face1: 4400,
    face2: 8400,
  },
  cased: {
    jambDepth: 18400,
    rabbet1: 0,
    rabbet2: 0,
    stop1: 0,
    stop2: 0,
    face1: 6400,
    face2: 6400,
  },
  split: {
    jambDepth: 18400,
    rabbet1: 6000,
    rabbet2: 6000,
    stop1: 0,
    stop2: 0,
    face1: 6400,
    face2: 6400,
  },
  "slider-strike": {
    jambDepth: 18400,
    rabbet1: 6000,
    rabbet2: 6000,
    stop1: -2000,
    stop2: -2000,
    face1: 6400,
    face2: 6400,
  },
  "single-de-head": {
    jambDepth: 18400,
    rabbet1: 12300,
    rabbet2: 0,
    stop1: 2000,
    stop2: 0,
    face1: 6400,
    face2: 8400,
  },
};

/**
 * Get Default values for Profile Return by Profile Return shape
 * @param {*} profileReturnShape Profile Return Shape
 * @param {*} jambDepth Profile Jamb depth
 * @returns Profile return configuration
 */
function getDefaultProfileReturn(profileReturnShape, jambDepth) {
  if (isStringEmptyOrNull(profileReturnShape)) {
    return null;
  }

  const profileReturn = {
    type: profileReturnShape,
    backBend1: 0,
    backBend2: 0,
    return1: 0,
    return1A: 0,
    return2: 0,
    return2A: 0,
    radius1: 0,
    radius2: 0,
  };
  switch (profileReturnShape.toLowerCase()) {
    case PROFILE_RETURN_TYPE_HEMMED:
      profileReturn.return1 = profileReturn.return2 = 1200;
      break;
    case PROFILE_RETURN_TYPE_MASONRY:
      profileReturn.return1 = profileReturn.return2 =
        jambDepth === 18400 ? 1400 : 1600; // 7/16" for 5 3/4" jambDepth else 1/2"
      break;
    case PROFILE_RETURN_TYPE_MASONRY_575:
      profileReturn.return1 = profileReturn.return2 = 1400;
      break;
    case PROFILE_RETURN_TYPE_DRYWALL:
      profileReturn.backBend1 = profileReturn.backBend2 = 1200;
      profileReturn.return1 = profileReturn.return2 = 1600;
      break;
    case PROFILE_RETURN_TYPE_PLASTER_RETURN:
      profileReturn.return1 = profileReturn.return2 = 1600;
      break;
    case PROFILE_RETURN_TYPE_NAIL_FLANGE:
      profileReturn.backBend1 = profileReturn.backBend2 = -1600;
      profileReturn.return1 = profileReturn.return2 = 1600;
      break;
    case PROFILE_RETURN_TYPE_SHADOW_BOX:
      profileReturn.backBend1 = profileReturn.backBend2 = 1600;
      profileReturn.return1 = profileReturn.return2 = 1600;
      profileReturn.return1A = profileReturn.return2A = 1600;
      break;
    case PROFILE_RETURN_TYPE_SHADOW_BOX_RETURN:
      profileReturn.backBend1 = profileReturn.backBend2 = 1600;
      profileReturn.return1 = profileReturn.return2 = 1600;
      break;
    case PROFILE_RETURN_TYPE_RADIUS:
      profileReturn.backBend1 = profileReturn.backBend2 = 1600;
      profileReturn.return1 = profileReturn.return2 = 3200;
      break;
    default:
      break;
  }

  return profileReturn;
}

export { profileShapeDefaults, getDefaultProfileReturn };
