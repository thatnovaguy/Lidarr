import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inputTypes, kinds } from 'Helpers/Props';
import Button from 'Components/Link/Button';
import SpinnerButton from 'Components/Link/SpinnerButton';
import ModalContent from 'Components/Modal/ModalContent';
import ModalHeader from 'Components/Modal/ModalHeader';
import ModalBody from 'Components/Modal/ModalBody';
import ModalFooter from 'Components/Modal/ModalFooter';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormLabel from 'Components/Form/FormLabel';
import FormInputGroup from 'Components/Form/FormInputGroup';
import styles from './EditArtistModalContent.css';

class EditArtistModalContent extends Component {

  //
  // Render

  render() {
    const {
      artistName,
      item,
      isSaving,
      showLanguageProfile,
      showMetadataProfile,
      onInputChange,
      onSavePress,
      onModalClose,
      onDeleteArtistPress,
      ...otherProps
    } = this.props;

    const {
      monitored,
      albumFolder,
      qualityProfileId,
      languageProfileId,
      metadataProfileId,
      path,
      tags
    } = item;

    return (
      <ModalContent onModalClose={onModalClose}>
        <ModalHeader>
          Edit - {artistName}
        </ModalHeader>

        <ModalBody>
          <Form
            {...otherProps}
          >
            <FormGroup>
              <FormLabel>Monitored</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="monitored"
                helpText="Download monitored albums from this artist"
                {...monitored}
                onChange={onInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Use Album Folder</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="albumFolder"
                helpText="Sort tracks into album folders"
                {...albumFolder}
                onChange={onInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Quality Profile</FormLabel>

              <FormInputGroup
                type={inputTypes.QUALITY_PROFILE_SELECT}
                name="qualityProfileId"
                {...qualityProfileId}
                onChange={onInputChange}
              />
            </FormGroup>

            {
              showLanguageProfile &&
                <FormGroup>
                  <FormLabel>Language Profile</FormLabel>

                  <FormInputGroup
                    type={inputTypes.LANGUAGE_PROFILE_SELECT}
                    name="languageProfileId"
                    {...languageProfileId}
                    onChange={onInputChange}
                  />
                </FormGroup>
            }

            {
              showMetadataProfile &&
                <FormGroup>
                  <FormLabel>Metadata Profile</FormLabel>

                  <FormInputGroup
                    type={inputTypes.METADATA_PROFILE_SELECT}
                    name="metadataProfileId"
                    helpText="Changes will take place on next artist refresh"
                    {...metadataProfileId}
                    onChange={onInputChange}
                  />
                </FormGroup>
            }

            <FormGroup>
              <FormLabel>Path</FormLabel>

              <FormInputGroup
                type={inputTypes.PATH}
                name="path"
                {...path}
                onChange={onInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Tags</FormLabel>

              <FormInputGroup
                type={inputTypes.TAG}
                name="tags"
                {...tags}
                onChange={onInputChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            className={styles.deleteButton}
            kind={kinds.DANGER}
            onPress={onDeleteArtistPress}
          >
            Delete
          </Button>

          <Button
            onPress={onModalClose}
          >
            Cancel
          </Button>

          <SpinnerButton
            isSpinning={isSaving}
            onPress={onSavePress}
          >
            Save
          </SpinnerButton>
        </ModalFooter>
      </ModalContent>
    );
  }
}

EditArtistModalContent.propTypes = {
  artistId: PropTypes.number.isRequired,
  artistName: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  isSaving: PropTypes.bool.isRequired,
  showLanguageProfile: PropTypes.bool.isRequired,
  showMetadataProfile: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSavePress: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired,
  onDeleteArtistPress: PropTypes.func.isRequired
};

export default EditArtistModalContent;
