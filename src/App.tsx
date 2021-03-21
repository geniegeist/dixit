
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from 'styled-components';
import { DixitClient } from './client';

import Cover from './assets/ui/DIXIT_COVER_72dpi.jpg';

const App = () => {
  return (
    <Wrapper>
      <Router>
        <Switch>
          <Route path="/:matchID/:numPlayers/:playerID" exact={true}>
            <DixitClient debug={false} />
          </Route>
          <Route path="/debug">
            <DixitClient debug={true} />
          </Route>
          <Route>
            <div>
              Willkommen zu Dixit!
            </div>
          </Route>
        </Switch>
      </Router>
    </Wrapper>
  );
}

const Wrapper = styled.div`

`;

export default App;
