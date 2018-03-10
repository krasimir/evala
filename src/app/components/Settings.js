/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      geo: {
        lat: props.geo.lat,
        lng: props.geo.lng
      },
      customWeatherURL: false,
      newDataProviderURL: props.dataProviderURL || ''
    };
  }
  componentWillReceiveProps(newProps) {
    if (newProps.geo) {
      this.setState({ geo: newProps.geo });
    }
  }
  render() {
    const geoLocationStr = this.props.forecastData ?
      (
        <p>
          { `${ this.props.forecastData.city }, ${ this.props.forecastData.country }, ${ this.props.forecastData.timezone }` }
        </p>
      ) : null;

    return (
      <div className='settings'>
        <a onClick={ () => this.props.children() } className='close'><i className='fa fa-times'></i></a>
        <h1>Terminal</h1>
        <p style={{ lineHeight: '2em' }}>
          <code>Ctrl</code> + <code>Shift</code> + <code>Alt</code> + <code>+</code> - Increase font size<br />
          <code>Ctrl</code> + <code>Shift</code> + <code>Alt</code> + <code>-</code> - Decrease font size<br />
          <code>Ctrl</code> + <code>Shift</code> + <code>Alt</code> + <code>v</code> - Split vertically<br />
          <code>Ctrl</code> + <code>Shift</code> + <code>Alt</code> + <code>h</code> - Split horizontally<br />
          <code>Ctrl</code> + <code>Shift</code> + <code>Alt</code> + <code>w</code> - Close terminal<br />
        </p>
        <h1>Forecast</h1>
        { geoLocationStr }
        <div>
          <form>
            <label style={{ justifySelf: 'right' }}>
              Latitude:<br />
              <input type='number' value={ this.state.geo.lat }
                onChange={ e => this._onGeoInputFieldChange('lat', e.target.value) }/>
            </label>
            <label style={{ justifySelf: 'left' }}>
              Longitude:<br />
              <input type='number' value={ this.state.geo.lng }
                onChange={ e => this._onGeoInputFieldChange('lng', e.target.value) }/>
            </label>
          </form>
          <p>
            { this.state.customWeatherURL || (this.props.dataProviderURL && this.props.dataProviderURL !== '') ?
              <label style={{ justifySelf: 'left' }}>
                Weather data provider URL:<br />
                <input type='text' defaultValue={ this.props.dataProviderURL }
                  onChange={ e => this._onDataProviderURLChange(e.target.value) }/>
              </label> :
              <a className='button' onClick={ () => this.setState({ customWeatherURL: true }) }>Set a custom Weather data provider</a>
            }
          </p>
          <p>
            <a className='button' onClick={ () => {
              this.props.saveDataProvider(this.state.newDataProviderURL);
              this.props.saveGeo(this.state.geo);
            }}><i className='fa fa-save'></i> Save changes</a>
            <a className='button' title='Localize me' onClick={ () => this.props.refresh() }><i className='fa fa-map-marker'></i></a>
          </p>
        </div>
      </div>
    );
  }
  _onGeoInputFieldChange(field, value) {
    this.setState({ geo: { ...this.state.geo, [field]: value }});
  }
  _onDataProviderURLChange(value) {
    this.setState({ newDataProviderURL: value });
  }
};

Settings.propTypes = {
  children: PropTypes.func,
  geo: PropTypes.object,
  forecastData: PropTypes.object,
  saveGeo: PropTypes.func,
  refresh: PropTypes.func,
  saveDataProvider: PropTypes.func,
  dataProviderURL: PropTypes.string
};

export default connect(Settings)
  .with('Weather')
  .map(({ geo, saveGeo, refresh, state, dataProviderURL, saveDataProvider }) => ({
    geo: geo(),
    saveGeo,
    refresh,
    forecastData: state.data,
    dataProviderURL: dataProviderURL(),
    saveDataProvider
  }));
