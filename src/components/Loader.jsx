import Spinner from 'react-spinner-material';

export function Loader() {
    return (
        // <div className='flex justify-center items-center'>
        //     <Spinner radius={120} color={"#333"} stroke={10} visible={true} />
        // </div>
        <div className="container">
            <div className="loadingspinner">
                <div id="square1"></div>
                <div id="square2"></div>
                <div id="square3"></div>
                <div id="square4"></div>
                <div id="square5"></div>
            </div>
        </div>
    );
}