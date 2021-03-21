import styled from 'styled-components';
import type { Card, Player } from '../game/game';
import BottomNavigation from './BottomNavigation';
import CARD_BACK_IMG from '../assets/ui/card-back.png';
import CARD_LABEL_IMG from '../assets/ui/card-label.png';
import CAMPFIRE_IMG from '../assets/ui/DIXIT_ELEMENT_8.png';
import DixitImageLoader from '../DixitImageLoader';

import useSound from 'use-sound';
const ClickSound = require('../assets/audio/UI_MouseClick_01.ogg').default;
const DropSound = require('../assets/audio/collection_manager_card_mouse_over.ogg').default;

type Props = {
    isStoryteller: boolean;
    players: Player[];
    playerId: string;
    onSelectCard: (card: Card) => void;
}

const FACTOR = 0.9;

const CARD_DIMENSION = {
    width: `${159 * FACTOR}px`,
    height: `${242 * FACTOR}px`
}

const Phase02OtherChoose = ({ isStoryteller, players, playerId, onSelectCard }: Props) => {
    let bottomText = "";
    let didIPlace = players[parseInt(playerId)].hand.length === 5

    const [playActive] = useSound(
        ClickSound,
        { volume: 1 }
    );

    const [playDropSound] = useSound(
        DropSound,
        { volume: 0.5 }
    );

    if (isStoryteller) {
        bottomText = "Deine Mitspieler müssen nun eine Karte legen, die zu deiner Erzählung passt. Warte...";
    } else {
        if (didIPlace) {
            bottomText = "Deine Karte wurde verdeckt auf dem Spielfeld gelegt. Als nächstes müsst ihr erraten, welche der Karten die Karte des Erzählers ist.";
        } else {
            bottomText = "Wähle eine Karte aus, die zu der Erzählung passt.";
        }
    }

    return (
        <Wrapper>
            <Main>
                {(isStoryteller || (didIPlace === true)) &&
                    <PlacedCardsWrapper>
                        {players.map(pl => {
                            const didPlaceCard = pl.hand.length === 5;

                            return (
                                <CardPlaceholder id={pl.id} showBG={didPlaceCard}>
                                    <CardLabel>
                                        {pl.name}
                                    </CardLabel>
                                    {didPlaceCard === false &&
                                        <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", fontFamily: "RecoletaAlt", color: "white" }}>
                                            Warte...
                                    </div>
                                    }
                                </CardPlaceholder>
                            );
                        })}
                    </PlacedCardsWrapper>
                }
                {didIPlace === false &&
                    <>
                        <HandCards>
                            {players[parseInt(playerId)].hand.map(card => {
                                return (
                                    <HandCard clickable={true} key={card.id} onClick={() => {onSelectCard(card); playActive()}}>
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
                                Welche deiner Karten passt zu der Erzählung?
                            </p>
                        </HintWrapper>
                    </>
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
    height: 80%;
    width: 100%;
`;

const PlacedCardsWrapper = styled.div`
    display: flex;
`;

const CardPlaceholder = styled.div<{ showBG: boolean }>`
    width: 144px;
    height: 218px;
    background-image: url(${props => props.showBG ? CARD_BACK_IMG : ""});
    background-size: cover;
    border-radius: 16px;
    margin: 0.5em;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: ${props => props.showBG ? "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)" : ""};
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
`;

const CardLabel = styled.div`
    background-image: url(${CARD_LABEL_IMG});
    background-size: cover;
    width: 80%;
    height: 35px;
    border-radius: 8px;
    margin-top: 0.8em;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: RecoletaAlt;
    font-weight: bold;
    color: #5E1313;
`;

const Bottom = styled.div`
    position: fixed;
    width: 100%;
    height: 100px;
    bottom: 0;
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


export default Phase02OtherChoose;