import { useState } from 'react';
import styled from 'styled-components';
import type { Card, Player } from '../game/game';
import BottomNavigation from './BottomNavigation';
import CARD_BACK_IMG from '../assets/ui/card-back.png';
import CARD_LABEL_IMG from '../assets/ui/card-label.png';
import CARD_LABEL2_IMG from '../assets/ui/card-label2.png';
import CAMPFIRE_IMG from '../assets/ui/DIXIT_ELEMENT_8.png';
import CHECKMARK_IMG from '../assets/ui/checkmark.png';
import DixitImageLoader from '../DixitImageLoader';

type Props = {
    candidates: {card: Card, owner: Player, votedBy: Player[]}[];
    score: number[];
    oldScore: number[];
    onContinue: () => void;
    didContinue: boolean;
}


const FACTOR = 0.9;

const CARD_DIMENSION = {
    width: `${159 * FACTOR}px`,
    height: `${242 * FACTOR}px`
}

const Phase04Result = ({ candidates, score, oldScore, onContinue, didContinue }: Props) => {
    return (
        <Wrapper>
            <Main>
                <CardList>
                    {candidates.map(candidate => {
                        return (
                            <div key={candidate.card.id} style={{display: "flex", flexDirection: "column"}}>
                                <Label type="1">
                                    {candidate.owner.name}
                                    <span style={{marginLeft: "0.5em", color: "black"}}>
                                        {`(${oldScore[parseInt(candidate.owner.id)]} + ${score[parseInt(candidate.owner.id)] - oldScore[parseInt(candidate.owner.id)]})`}
                                    </span>
                                </Label>
                                <CardImg src={DixitImageLoader.load(candidate.card.id)} />
                                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                    {candidate.votedBy.map(c => {
                                        return (
                                            <Label type="2">{c.name}</Label>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })};
                </CardList>
                {didContinue === false && 
                <Button onClick={() => onContinue()}>
                    Weiter
                </Button>
                }
                
            </Main>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
`;

const Main = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 80%;
    width: 100%;
    position: relative;
`;

const CardList = styled.div`
    display: flex;
    justify-content: center;
`;


const Label = styled.div<{type: "1" | "2"}>`
    background-image: url(${props => props.type === "1" ? CARD_LABEL_IMG : CARD_LABEL2_IMG});
    background-size: cover;
    height: 35px;
    border-radius: 8px;
    padding: 0.1em 0.5em;
    margin: 0.3em 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: RecoletaAlt;
    font-weight: bold;
    color: #5E1313;
    position: relative;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
`;

const Bottom = styled.div`
    position: fixed;
    width: 100%;
    height: 100px;
    bottom: 0;
`;

const CardImg = styled.img`
    width: ${CARD_DIMENSION.width};
    height: ${CARD_DIMENSION.height};
    border-radius: 16px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    margin: 1em;

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
`;

const Button = styled.div`
    padding: 1em;
    background-color: #0091FF;
    color: white;
    cursor: pointer;
    border-radius: 12px;
    margin: 1em;
    text-align: center;
    position: absolute;
    bottom: -20px;
    right: 20px;
`;


export default Phase04Result;