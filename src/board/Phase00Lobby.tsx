import { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { Card, Player } from '../game/game';
import CAMPFIRE_IMG from '../assets/ui/DIXIT_ELEMENT_8.png';
import LOGO from '../assets/ui/DIXIT_BASE_LOGO_72dpi.png';
import useSound from 'use-sound';
const ClickSound = require('../assets/audio/UI_MouseClick_01.ogg').default;
const DropSound = require('../assets/audio/collection_manager_card_mouse_over.ogg').default;


type Props = {
    changeName: (name: string) => void;
    ready: () => void;
    name: string;
    isReady: boolean;
}

const Phase00Lobby = ({ changeName, ready, name, isReady }: Props) => {
    const [playerName, setPlayerName] = useState(name);
    const [textFieldName, setTextFieldName] = useState(name);

    return (
        <Wrapper>
            <img src={LOGO} width="500px" />
            <div>
                {isReady === false &&
                    <NameTextField type="text" value={textFieldName} onChange={evt => setTextFieldName(evt.target.value)} /> 
                }
                {isReady === false &&
                    <button onClick={() => changeName(textFieldName)} style={{
                        backgroundColor: "#0091FF",
                        outline: "none",
                        border: "none",
                        color: "white",
                        borderRadius: "12px",
                        padding: "0.5em",
                    }}>
                        Name ändern
                    </button>
                }
            </div>
            {isReady === false &&
                <button style={{
                    marginTop: "1em",
                    padding: "1em"
                }} onClick={() => ready()}>
                        Bereit
                </button>
            }
            {isReady &&
                <p>Warte auf deine Mitspieler</p>
            }
        </Wrapper>
    );
}

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const NameTextField = styled.input`
    margin: 5em 1em 0 0;
    padding: 1em;
    border-radius: 12px;
    border: none;
    outline: none;
`;

export default Phase00Lobby;