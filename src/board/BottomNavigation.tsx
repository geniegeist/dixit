import styled from 'styled-components';
import WOMAN_IMG from '../assets/ui/DIXIT_ELEMENT_12.png';
import BG from '../assets/ui/bottom-navigation-background.png';
import CARD_LABEL_IMG from '../assets/ui/card-label.png';
import LABEL_SEPARATOR from '../assets/ui/label-separator.jpg';

type Props = {
    players: {id: string; name: string; score: number;}[];
    storyteller: string;
};

const BottomNavigation = (props: Props) => {
    return (
        <Wrapper>
            <AsianWomanImg src={WOMAN_IMG} />
            <Content>
                {props.players.map(pl => {
                    return (
                        <div key={pl.id} style={{position: "relative"}}>
                        {props.storyteller === pl.id &&
                            <div style={{position: "absolute", fontSize: "0.6em", top: "-1em", left: "50%", transform: "translate(-50%,0)", fontWeight: "bold", opacity: 0.9, display: "flex", alignItems: "center"}}>
                                Erzähler
                            </div>
                        }
                        <Label isGlowing={props.storyteller === pl.id}>
                            <span>
                                {pl.name}
                            </span>
                            <LabelSeparator src={LABEL_SEPARATOR} />
                            <span>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "black"
                                }}>
                                    <span style={{margin: 0, padding: 0, fontSize: "0.8em", lineHeight: "0.4em", marginTop: "0.5em"}}>
                                        {pl.score}
                                    </span>
                                    <span style={{margin: 0, padding: 0, fontSize: "0.5em"}}>
                                        Punkte
                                    </span>
                                </div>
                            </span>
                        </Label>
                        </div>
                    );
                })}
            </Content>
        </Wrapper>
    );

};

const Wrapper = styled.div`
    background-image: url(${BG});
    width: 1024px;
    max-width: 1024px;
    height: 100%;
    font-family: RecoletaAlt;
`;

const AsianWomanImg = styled.img`
    position: absolute;
    bottom: 0;
    left: 0;
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

const Content = styled.div`
    height: 100%;
    margin-left: 100px;
    margin-right: 300px;
    display: flex;
    align-items: center;
    color: white;
    font-size: 1.2em;
`;


const Label = styled.div<{isGlowing: boolean}>`
    background-image: url(${CARD_LABEL_IMG});
    background-size: cover;
    height: 35px;
    border-radius: 8px;
    padding: 0.1em 0.4em;
    margin: 0.5em;
    display: flex;
    align-items: center;
    font-family: RecoletaAlt;
    font-weight: bold;
    color: #5E1313;
    position: relative;
    box-shadow: ${props => props.isGlowing ? "0 0 24px rgba(255,232,100,0.9)" : ""};
`;

const LabelSeparator = styled.img`
    margin: 0 0.2em 0 0.6em;
`;

export default BottomNavigation;