import { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { Card, Player } from '../game/game';
import CAMPFIRE_IMG from '../assets/ui/DIXIT_ELEMENT_8.png';
import DixitImageLoader from '../DixitImageLoader';

import useSound from 'use-sound';
const ClickSound = require('../assets/audio/UI_MouseClick_01.ogg').default;
const DropSound = require('../assets/audio/collection_manager_card_mouse_over.ogg').default;

type Props = {
    handCards: Card[];
    storyteller: Player;
    isStoryteller: boolean;
    onChooseCard: (cardId: string) => void;

}

const FACTOR = 0.9;

const CARD_DIMENSION = {
    width: `${159 * FACTOR}px`,
    height: `${242 * FACTOR}px`
}

const Phase01StorytellerChoose = ({ handCards, storyteller, isStoryteller, onChooseCard }: Props) => {

    const [reviewCard, setReviewCard] = useState<null | Card>(null);

    const onClickHandCard = (card: Card) => {
        if (!isStoryteller) {
            return;
        }

        setReviewCard(card);
    }

    const [playActive] = useSound(
        ClickSound,
        { volume: 1 }
    );

    const [playDropSound] = useSound(
        DropSound,
        { volume: 0.5 }
    );

    return (
        <Wrapper>
            {(reviewCard === null || isStoryteller === false) &&
                <Main>
                    <HandCards>
                        {handCards.map(card => {
                            return (
                                <HandCard
                                    clickable={isStoryteller}
                                    key={card.id}
                                    onClick={() => {
                                        playActive();
                                        onClickHandCard(card);
                                    }}
                                >
                                    <HandCardImg width={CARD_DIMENSION.width} height={CARD_DIMENSION.height} src={DixitImageLoader.load(card.id)}
                                        onMouseEnter={() => {
                                            playDropSound();

                                        }}
                                    />
                                </HandCard>
                            );
                        })}
                    </HandCards>
                    <HintWrapper>
                        <CAMPFIRE src={CAMPFIRE_IMG} />
                        <p>
                            {isStoryteller === false ?
                                `${storyteller.name} ist Erzähler der Runde. Links siehst du deine Karten. Deine Aufgabe ist es, der Erzählung von ${storyteller.name} zuzuhören und zu überlegen, welche deiner Karten zu der Erzählung passen könnte.` :
                                "Du bist Erzähler in dieser Runde. Links siehst du deine Karten. Du musst eine auswählen und sie deinen Mitspielern beschreiben."
                            }
                        </p>
                        <p style={{ fontWeight: "bold" }}>
                            {isStoryteller === false ?
                                `Warte auf ${storyteller.name}...` : `Klicke auf eine Karte`
                            }
                        </p>
                    </HintWrapper>
                </Main>
            }
            {reviewCard !== null &&
                <ReviewMain>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <ReviewCardImg width={`${304 * 0.8}px`} height={`${462 * 0.8}px`} src={DixitImageLoader.load(reviewCard.id)} />
                        <HintWrapper>
                            <CAMPFIRE src={CAMPFIRE_IMG} />
                            <p>
                                Denke dir eine Erzählung zu der Karte aus. Nutze einzelne Wörter, Sätze, Zitate, Lautmalerei oder was dir sonst noch so einfällt.
                            </p>
                            <p style={{ fontWeight: "bold" }}>
                                Erzähle deinen Mitspielern deine Erzählung und klicke dann auf Weiter.
                            </p>
                        </HintWrapper>
                    </div>
                    <div style={{ display: "flex" }}>
                        <Button onClick={() => {
                            setReviewCard(null);
                            playActive();
                        }}>Zurück</Button>
                        <Button onClick={() => {
                            onChooseCard(reviewCard.id);
                            playActive();
                        }}>Ich habe meine Karte beschrieben</Button>
                    </div>
                </ReviewMain>
            }
        </Wrapper>
    );
}

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
`;

const Button = styled.div`
    padding: 1em;
    background-color: #0091FF;
    color: white;
    cursor: pointer;
    border-radius: 12px;
    margin: 1em;
`;

const Main = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80%;
    width: 100%;
`;

const ReviewMain = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 80%;
    width: 100%;
`;

const HandCards = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    width: 600px;
`;

const HandCard = styled.div<{ clickable: boolean }>`
    width: ${CARD_DIMENSION.width};
    height: ${CARD_DIMENSION.height};
    padding: 8px 16px;
    cursor: ${props => props.clickable ? "pointer" : "default"};
`;

const HandCardImg = styled.img`
    border-radius: 16px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);

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
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        transform: scale(1.6);
        transform-origin: 50% 40%;
    }
`;

const ReviewCardImg = styled.img`
    border-radius: 16px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    margin: 1em 2em;

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
    width: 250px;
`;

export default Phase01StorytellerChoose;