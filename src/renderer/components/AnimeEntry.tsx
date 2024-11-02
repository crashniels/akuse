import './styles/AnimeEntry.css';

import { faCalendar, faCircleDot } from '@fortawesome/free-regular-svg-icons';
import { faTv } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import {
  getAvailableEpisodes,
  getParsedFormat,
  getParsedSeasonYear,
  getTitle,
} from '../../modules/utils';
import { ListAnimeData } from '../../types/anilistAPITypes';
import AnimeModal from './modals/AnimeModal';
import { setFocus, useFocusable } from '@noriginmedia/norigin-spatial-navigation';

const StatusDot: React.FC<{
  listAnimeData?: ListAnimeData | undefined;
}> = ({ listAnimeData }) => {
  return (
    <>
      {(listAnimeData?.media.mediaListEntry?.status == 'CURRENT' ||
        listAnimeData?.media.mediaListEntry?.status == 'REPEATING') &&
      listAnimeData.media.mediaListEntry.progress !==
        getAvailableEpisodes(listAnimeData.media) ? (
        <span className="up-to-date">
          <FontAwesomeIcon
            className="i"
            icon={faCircleDot}
            style={{ marginRight: 5 }}
          />
        </span>
      ) : (
        listAnimeData?.media.status === 'RELEASING' && (
          <span className="releasing">
            <FontAwesomeIcon
              className="i"
              icon={faCircleDot}
              style={{ marginRight: 5 }}
            />
          </span>
        )
      )}
      {listAnimeData?.media.status === 'NOT_YET_RELEASED' && (
        <span className="not-yet-released">
          <FontAwesomeIcon
            className="i"
            icon={faCircleDot}
            style={{ marginRight: 5 }}
          />
        </span>
      )}
    </>
  );
};

const AnimeEntry: React.FC<{
  listAnimeData?: ListAnimeData;
  onClick?: () => any;
  key?: number;
}> = ({ listAnimeData, onClick, key }) => {
  // wether the modal is shown or not
  const [showModal, setShowModal] = useState<boolean>(false);
  // wether the modal has been opened at least once (used to fetch episodes info only once when opening it)
  const [hasModalBeenShowed, setHasModalBeenShowed] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const modalRef = useRef(null);
  const { ref, focused } = useFocusable();
  // Enter should trigger same as left click
  const handleKeyEvent = (event: React.KeyboardEvent) => {
    console.log('Component mounted or updated');
    if ((event.code === 'Enter')) {
      setShowModal(true);
      if (!hasModalBeenShowed) setHasModalBeenShowed(true);
      onblur
    }
  };
  const handleMouseEvent = (event: React.MouseEvent) => {
    setShowModal(true);
    onClick && onClick();
    if (!hasModalBeenShowed) setHasModalBeenShowed(true);
    setFocus("MENU");
  }

  return (<div tabIndex={0} onKeyDown={handleKeyEvent} ref={ref} className={focused ? 'button-focused' : 'button'}>
    <>
      {listAnimeData && hasModalBeenShowed && (
        <AnimeModal
          ref={modalRef}
          listAnimeData={listAnimeData}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
      <div onClick={handleMouseEvent} className={`anime-entry show ${listAnimeData ? '' : 'skeleton'}`}>
        {listAnimeData && listAnimeData.media ? (
          <div
            className="anime-cover"
            style={{
              backgroundColor: !imageLoaded
                ? listAnimeData.media.coverImage?.color
                : 'transparent',
            }}
          >
            <img
              src={listAnimeData.media.coverImage?.large}
              alt="anime cover"
              onLoad={() => {
                setImageLoaded(true);
              }}
            />
          </div>
        ) : (
          <Skeleton className="anime-cover" />
        )}

        <div className="anime-content">
          <div className="anime-title">
            {listAnimeData && listAnimeData.media ? (
              <>
                <StatusDot listAnimeData={listAnimeData} />
                {getTitle(listAnimeData.media)}
              </>
            ) : (
              <Skeleton count={2} />
            )}
          </div>

          <div className="anime-info">
            <div className="season-year">
              {listAnimeData && listAnimeData.media && (
                <FontAwesomeIcon
                  className="i"
                  icon={faCalendar}
                  style={{ marginRight: 5 }}
                />
              )}
              {listAnimeData && listAnimeData.media ? (
                getParsedSeasonYear(listAnimeData?.media)
              ) : (
                <Skeleton />
              )}
            </div>
            <div className="episodes">
              {listAnimeData && listAnimeData.media ? (
                getParsedFormat(listAnimeData?.media.format)
              ) : (
                <Skeleton />
              )}
              {listAnimeData && listAnimeData.media && (
                <FontAwesomeIcon
                  className="i"
                  icon={faTv}
                  style={{ marginLeft: 5 }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  </div>
  );
};

export default AnimeEntry;
