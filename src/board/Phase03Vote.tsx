import { useState } from 'react';
import styled from 'styled-components';
import type { Card, Player } from '../game/game';
import BottomNavigation from './BottomNavigation';
import CARD_BACK_IMG from '../assets/ui/card-back.png';
import CARD_LABEL_IMG from '../assets/ui/card-label.png';
import CAMPFIRE_IMG from '../assets/ui/DIXIT_ELEMENT_8.png';
import CHECKMARK_IMG from '../assets/ui/checkmark.png';
import useSound from 'use-sound';
import DixitImageLoader from '../DixitImageLoader';

const ClickSound = require('../assets/audio/Hub_Click.ogg').default;
const DropSound = require('../assets/audio/collection_manager_card_mouse_over.ogg').default;

type Props = {
    isStoryteller: boolean;
    storytellerName: string;
    playerState: {name: string, didVote: boolean, id: string}[];
    candidates: {card: Card, isMine: boolean}[];
    vote: (cardId: string) => void;
    didVote: string | undefined;
}


const FACTOR = 0.8;

const CARD_DIMENSION = {
    width: `${159 * FACTOR}px`,
    height: `${242 * FACTOR}px`
}

const Phase03Vote = ({ isStoryteller, storytellerName, playerState, candidates, vote, didVote }: Props) => {
    const [playActive] = useSound(
        ClickSound,
        { volume: 0.3 }
    );

    const [playDropSound] = useSound(
        DropSound,
        { volume: 0.5 }
    );

    let bottomText = "";
    if (isStoryteller) {
        bottomText = "Dies sind die Karten von dir und deinen Mitspielern. Jetzt erraten deine Mitspieler, welche Karte du wohl gelegt hast.";
    } else {
        if (didVote) {
            bottomText = `Warte auf deine Mitspieler.`;

        } else {
            bottomText = `Jetzt musst du überlegen, welche der gelegten Karten die Karte von ${storytellerName} sein könnte. Klicke auf die Karte. Du kannst nicht für deine Karte abstimmen.`;
        }
    }

    return (
        <Wrapper>
            <Top>
                {playerState.map(state => {
                    return (
                        <Label key={state.id}>
                            {state.name}
                            {state.didVote && <Checkmark src={CHECKMARK_IMG} />}
                        </Label>
                    )
                })}
            </Top>
            <Main>
                <CardList>
                    {candidates.map(candidate => {
                        return (
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <CardImg src={DixitImageLoader.load(candidate.card.id)} isActive={didVote === undefined || didVote === candidate.card.id} onMouseEnter={()=>{
                                    if (didVote === undefined) {
                                        playDropSound();
                                    }
                                }}/>
                                {isStoryteller === false && candidate.isMine === false && didVote === undefined &&
                                    <Button onClick={() => {
                                        playActive();
                                        vote(candidate.card.id);
                                    }}>Abstimmen</Button>
                                }
                            </div>
                        );
                    })};
                </CardList>
            </Main>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
`;

const Top = styled.div`
    display: flex;
`;

const Main = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80%;
    width: 100%;
`;

const CardList = styled.div`
    display: flex;
    justify-content: center;
`;


const Label = styled.div`
    background-image: url(${CARD_LABEL_IMG});
    background-size: cover;
    height: 35px;
    border-radius: 8px;
    padding: 0.1em 1em;
    margin: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: RecoletaAlt;
    font-weight: bold;
    color: #5E1313;
    position: relative;
`;

const Bottom = styled.div`
    position: fixed;
    width: 100%;
    height: 100px;
    bottom: 0;
`;

const Checkmark = styled.img`
    position: absolute;
    right: -25%;
    top: 0%;
    width: 30px;
`;

const CardImg = styled.img<{isActive: boolean}>`
    width: ${CARD_DIMENSION.width};
    height: ${CARD_DIMENSION.height};
    border-radius: 16px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    margin: 1em;
    opacity: ${props => props.isActive ? 1 : 0.66};

    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;

    :hover {
        box-shadow:${props => props.isActive ? "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)" : ""};
        transform: ${props => props.isActive ? "scale(1.6)" : ""};
        transform-origin: 50% 40%;
    }
`;



const CAMPFIRE = styled.img`
    width: 150px;
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translate(-50%,-100%);
`;

const HintWrapper = styled.div`
    position: relative;
    font-family: RecoletaAlt;
    background-color: #F7B500;
    border-radius: 16px;
    text-align: center;
    padding: 1em;
    width: 200px;
`;

const Button = styled.div`
    padding: 1em;
    background-color: #0091FF;
    color: white;
    cursor: pointer;
    border-radius: 12px;
    margin: 1em;
    text-align: center;
`;


export default Phase03Vote;