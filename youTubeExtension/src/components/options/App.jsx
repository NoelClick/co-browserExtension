import React, { useRef, useEffect, useState } from 'react';
import StorageService from '../../Services/StorageService';
import OptionsService from '../../Services/OptionsService';
import API from '../../Services/API';
import clsx from 'clsx';
import './App.css';

const options = new OptionsService(new StorageService());

async function pingApi(baseUrl) {
    try {
        const url = new URL(baseUrl);
        const api = new API(null, null, baseUrl);
        return !!url && await api.ping()
    } catch {
        return false;
    }
}

export default function App() {
    const [enableDomManipulation, setEnableDomManipulation] = useState(false);
    const [enablePauseChannelTrailer, setEnablePauseChannelTrailer] = useState(false);
    const [enableVideoPlayerManipulation, setEnableVideoPlayerManipulation] = useState(true);
    const [hideDislikeVideoButton, setHideDislikeVideoButton] = useState(false);
    const [hideDownloadVideoButton, setHideDownloadVideoButton] = useState(false);
    const [hideClipVideoButton, setHideClipVideoButton] = useState(false);
    const [hideThankVideoButton, setHideThankVideoButton] = useState(false);
    const [hideSaveVideoButton, setHideSaveVideoButton] = useState(false);
    const [hideRecommendationPromps, setHideRecommendationPromps] = useState(false);
    const [apiBaseUrl, setApiBaseUrl] = useState('');
    const [apiBaseUrlValid, setApiBaseUrlValid] = useState(true);
    const [apiUsername, setApiUsername] = useState('');
    const [apiPassword, setApiPassword] = useState('');
    const enableEndVideoButton = useRef();
    const subscriptionboxReloadSeconds = useRef();
    const pingApiId = useRef(0);

    const checkBaseUrlValid = async url => {
        const pingId = ++pingApiId.current;
        const baseUrlValid = await pingApi(url);

        if (pingId === pingApiId.current) {
            setApiBaseUrlValid(baseUrlValid);
        }
    }

    useEffect(() => {
        (async () => {
            await options.load();

            setEnableDomManipulation(!!options.isDomManipulationEnabled);
            setEnablePauseChannelTrailer(!!options.isPauseChannelTrailerEnabled);
            setEnableVideoPlayerManipulation(!!options.isVideoPlayerManipulationEnabled);

            setHideDislikeVideoButton(!!options.hideDislikeVideoButton);
            setHideDownloadVideoButton(!!options.hideDownloadVideoButton);
            setHideClipVideoButton(!!options.hideClipVideoButton);
            setHideThankVideoButton(!!options.hideThankVideoButton);
            setHideSaveVideoButton(!!options.hideSaveVideoButton);
            setHideRecommendationPromps(!!options.hideRecommendationPromps);

            setApiBaseUrl(options.apiBaseUrl);
            setApiUsername(options.apiUsername);
            setApiPassword(options.apiPassword);

            checkBaseUrlValid(options.apiBaseUrl);
        })();
    }, [options]);

    useEffect(() => {
        checkBaseUrlValid(apiBaseUrl);
    }, [apiBaseUrl]);

    const saveOptions = () => {
        options.isDomManipulationEnabled = !!enableDomManipulation;
        options.subscriptionBoxReloadSeconds = parseInt(subscriptionboxReloadSeconds.current.value, 10);

        options.isVideoPlayerManipulationEnabled = !!enableVideoPlayerManipulation;
        options.isPauseChannelTrailerEnabled = !!enablePauseChannelTrailer;
        options.isEndVideoButtonEnabled = !!enableEndVideoButton.current.checked;

        options.hideDislikeVideoButton = !!hideDislikeVideoButton;
        options.hideDownloadVideoButton = !!hideDownloadVideoButton;
        options.hideClipVideoButton = !!hideClipVideoButton;
        options.hideThankVideoButton = !!hideThankVideoButton;
        options.hideSaveVideoButton = !!hideSaveVideoButton;
        options.hideRecommendationPromps = !!hideRecommendationPromps;

        options.apiBaseUrl = apiBaseUrl;
        options.apiUsername = apiUsername;
        options.apiPassword = apiPassword;

        alert('Options saved!');
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>YouTube Extension Options</h1>
            </div>

            <div className="form-section">
                <h2>User Interface Manipulation</h2>

                <div className="info-text">
                    Adds various additional elements to user interface.
                </div>

                <div className="form-group">
                    <input
                        id="enable-dom-manipulation"
                        type="checkbox"
                        checked={enableDomManipulation}
                        onChange={e => setEnableDomManipulation(e.target.checked)}
                    />
                    <label htmlFor="enable-dom-manipulation">Enable various user interface manipulations</label>
                </div>

                <div className="form-group">
                    <label htmlFor="subscriptionbox-reload-time">Subscription box reload countdown in seconds</label>
                    <input
                        ref={subscriptionboxReloadSeconds}
                        id="subscriptionbox-reload-time"
                        type="number"
                        min="1"
                        step="1"
                        className="form-control"
                        defaultValue={options.subscriptionBoxReloadSeconds}
                        disabled={!enableDomManipulation}
                    />
                </div>
            </div>

            <div className="form-section">
                <h2>Video Player Manipulation</h2>

                <div className="info-text">
                    Fast forwards, mutes and turn ads black.
                </div>

                <div className="form-group">
                    <input
                        id="enable-player-manipulation-video-button"
                        type="checkbox"
                        checked={enableVideoPlayerManipulation}
                        onChange={e => setEnableVideoPlayerManipulation(e.target.checked)}
                    />
                    <label htmlFor="enable-player-manipulation-video-button">Enable video player manipulation</label>
                </div>

                <div className="form-group">
                    <input
                        id="enable-pause-channel-trailer-button"
                        type="checkbox"
                        checked={enablePauseChannelTrailer}
                        onChange={e => setEnablePauseChannelTrailer(e.target.checked)}
                    />
                    <label htmlFor="enable-pause-channel-trailer-button">Enable pausing channel trailer</label>
                </div>

                <div className="form-group">
                    <input
                        ref={enableEndVideoButton}
                        id="enable-end-video-button"
                        type="checkbox"
                        defaultChecked={options.isEndVideoButtonEnabled}
                        disabled={!enableVideoPlayerManipulation}
                    />
                    <label htmlFor="enable-end-video-button">Enable end video button</label>
                </div>
            </div>

            <div className="form-section">
                <h2>Hide Elements</h2>

                <div className="info-text">
                    Hide certain GUI elements on site.
                </div>

                <div className="form-group">
                    <input
                        id="hide-dislike-video-button"
                        type="checkbox"
                        checked={hideDislikeVideoButton}
                        onChange={e => setHideDislikeVideoButton(e.target.checked)}
                    />
                    <label htmlFor="hide-dislike-video-button">Dislike video Button</label>
                </div>

                <div className="form-group">
                    <input
                        id="hide-download-video-button"
                        type="checkbox"
                        checked={hideDownloadVideoButton}
                        onChange={e => setHideDownloadVideoButton(e.target.checked)}
                    />
                    <label htmlFor="hide-download-video-button">Download video button</label>
                </div>

                <div className="form-group">
                    <input
                        id="hide-clip-video-button"
                        type="checkbox"
                        checked={hideClipVideoButton}
                        onChange={e => setHideClipVideoButton(e.target.checked)}
                    />
                    <label htmlFor="hide-clip-video-button">Clip video button</label>
                </div>

                <div className="form-group">
                    <input
                        id="hide-thank-video-button"
                        type="checkbox"
                        checked={hideThankVideoButton}
                        onChange={e => setHideThankVideoButton(e.target.checked)}
                    />
                    <label htmlFor="hide-thank-video-button">Thank video button</label>
                </div>

                <div className="form-group">
                    <input
                        id="hide-save-video-button"
                        type="checkbox"
                        checked={hideSaveVideoButton}
                        onChange={e => setHideSaveVideoButton(e.target.checked)}
                    />
                    <label htmlFor="hide-save-video-button">Save video button</label>
                </div>

                <div className="form-group">
                    <input
                        id="hide-recommendation-props"
                        type="checkbox"
                        checked={hideRecommendationPromps}
                        onChange={e => setHideRecommendationPromps(e.target.checked)}
                    />
                    <label htmlFor="hide-recommendation-props">Recommendation promps</label>
                </div>
            </div>

            <div className="form-section">
                <h2>API</h2>

                <div className="info-text">
                    Provides additional features like marking videos as watched and video scraping.
                    Disabled if not filled out.
                </div>

                <div className="form-group">
                    <label htmlFor="api-base-url">Base URL</label>
                    <input
                        id="api-base-url"
                        type="text"
                        className={clsx('form-control', apiBaseUrl && !apiBaseUrlValid && 'form-error')}
                        value={apiBaseUrl}
                        onChange={e => setApiBaseUrl(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="api-username">Username</label>
                    <input
                        id="api-username"
                        type="text"
                        className={clsx('form-control', apiBaseUrlValid && !apiUsername && 'form-error')}
                        value={apiUsername}
                        onChange={e => setApiUsername(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="api-password">Password</label>
                    <input
                        id="api-username"
                        type="password"
                        className={clsx('form-control', apiBaseUrlValid && !apiPassword && 'form-error')}
                        value={apiPassword}
                        onChange={e => setApiPassword(e.target.value)}
                    />
                </div>
            </div>


            <div>
                <button
                    className="btn"
                    onClick={saveOptions}
                    disabled={apiBaseUrl && !(apiBaseUrlValid && apiUsername && apiPassword)}
                >
                    Save
                </button>
            </div>
        </div >
    );
}