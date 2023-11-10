import {useParams} from 'react-router-dom';

function OglasDetalj({cardData}) {
    const {id} = useParams();
    const card = cardData.find(card => card.id === parseInt(id, 10));

    if (!card) {
        return <div>Card not found</div>;
    }

    return (
        <div>
            <h1>{card.title}</h1>
            <p>{card.content}</p>
        </div>
    );
}

export default OglasDetalj;