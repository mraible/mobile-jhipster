import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate, translate } from 'react-jhipster';
import { NavLink as Link } from 'react-router-dom';
import { NavDropdown } from './menu-components';

export const EntitiesMenu = props => (
  <NavDropdown
    icon="th-list"
    name={translate('global.menu.entities.main')}
    id="entity-menu"
    style={{ maxHeight: '80vh', overflow: 'auto' }}
  >
    <MenuItem icon="asterisk" to="/blood-pressure">
      <Translate contentKey="global.menu.entities.bloodPressure" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/weight">
      <Translate contentKey="global.menu.entities.weight" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/points">
      <Translate contentKey="global.menu.entities.points" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/preferences">
      <Translate contentKey="global.menu.entities.preferences" />
    </MenuItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
