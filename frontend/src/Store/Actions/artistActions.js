import _ from 'lodash';
import $ from 'jquery';
import { createAction } from 'redux-actions';
import { batchActions } from 'redux-batched-actions';
import { sortDirections } from 'Helpers/Props';
import { createThunk, handleThunks } from 'Store/thunks';
import createSetSettingValueReducer from './Creators/Reducers/createSetSettingValueReducer';
import createFetchHandler from './Creators/createFetchHandler';
import createSaveProviderHandler from './Creators/createSaveProviderHandler';
import createRemoveItemHandler from './Creators/createRemoveItemHandler';
import createHandleActions from './Creators/createHandleActions';
import { updateItem } from './baseActions';

//
// Variables

export const section = 'artist';

//
// State

export const defaultState = {
  isFetching: false,
  isPopulated: false,
  error: null,
  isSaving: false,
  saveError: null,
  items: [],
  sortKey: 'sortName',
  sortDirection: sortDirections.ASCENDING,
  pendingChanges: {}
};

//
// Actions Types

export const FETCH_ARTIST = 'artist/fetchArtist';
export const SET_ARTIST_VALUE = 'artist/setArtistValue';
export const SAVE_ARTIST = 'artist/saveArtist';
export const DELETE_ARTIST = 'artist/deleteArtist';

export const TOGGLE_ARTIST_MONITORED = 'artist/toggleArtistMonitored';
export const TOGGLE_ALBUM_MONITORED = 'artist/toggleAlbumMonitored';

//
// Action Creators

export const fetchArtist = createThunk(FETCH_ARTIST);
export const saveArtist = createThunk(SAVE_ARTIST);
export const deleteArtist = createThunk(DELETE_ARTIST);
export const toggleArtistMonitored = createThunk(TOGGLE_ARTIST_MONITORED);
export const toggleAlbumMonitored = createThunk(TOGGLE_ALBUM_MONITORED);

export const setArtistValue = createAction(SET_ARTIST_VALUE, (payload) => {
  return {
    section: 'artist',
    ...payload
  };
});

//
// Action Handlers

export const actionHandlers = handleThunks({

  [FETCH_ARTIST]: createFetchHandler(section, '/artist'),

  [SAVE_ARTIST]: createSaveProviderHandler(
    section, '/artist'),

  [DELETE_ARTIST]: createRemoveItemHandler(
    section,
    '/artist'
  ),

  [TOGGLE_ARTIST_MONITORED]: (getState, payload, dispatch) => {
    const {
      artistId: id,
      monitored
    } = payload;

    const artist = _.find(getState().artist.items, { id });

    dispatch(updateItem({
      id,
      section,
      isSaving: true
    }));

    const promise = $.ajax({
      url: `/artist/${id}`,
      method: 'PUT',
      data: JSON.stringify({
        ...artist,
        monitored
      }),
      dataType: 'json'
    });

    promise.done((data) => {
      dispatch(updateItem({
        id,
        section,
        isSaving: false,
        monitored
      }));
    });

    promise.fail((xhr) => {
      dispatch(updateItem({
        id,
        section,
        isSaving: false
      }));
    });
  },

  [TOGGLE_ALBUM_MONITORED]: (getState, payload, dispatch) => {
    const {
      artistId: id,
      seasonNumber,
      monitored
    } = payload;

    const artist = _.find(getState().artist.items, { id });
    const seasons = _.cloneDeep(artist.seasons);
    const season = _.find(seasons, { seasonNumber });

    season.isSaving = true;

    dispatch(updateItem({
      id,
      section,
      seasons
    }));

    season.monitored = monitored;

    const promise = $.ajax({
      url: `/artist/${id}`,
      method: 'PUT',
      data: JSON.stringify({
        ...artist,
        seasons
      }),
      dataType: 'json'
    });

    promise.done((data) => {
      const episodes = _.filter(getState().episodes.items, { artistId: id, seasonNumber });

      dispatch(batchActions([
        updateItem({
          id,
          section,
          ...data
        }),

        ...episodes.map((episode) => {
          return updateItem({
            id: episode.id,
            section: 'episodes',
            monitored
          });
        })
      ]));
    });

    promise.fail((xhr) => {
      dispatch(updateItem({
        id,
        section,
        seasons: artist.seasons
      }));
    });
  }

});

//
// Reducers

export const reducers = createHandleActions({

  [SET_ARTIST_VALUE]: createSetSettingValueReducer(section)

}, defaultState, section);
