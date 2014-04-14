<?php
namespace Craft;

class RelatedEntries_EntriesController extends BaseController
{
	/**
	 * Load entries through Ajax.
	 *
	 * @return string
	 */
	public function actionLoad()
    {
	    // Only perform this action if it's a POST through AJAX
	    $this->requirePostRequest();
        $this->requireAjaxRequest();

	    // Retrieve POST data
	    $offset = craft()->request->getPost('offset', 0);
	    $limit = craft()->request->getPost('limit', 0);
	    $section = craft()->request->getPost('section', 0);
	    $relatedEntryId = craft()->request->getPost('relatedEntryId', 0);

	    // Display entries and return HTML
	    $redered_template = craft()->templates->render('relatedentries/relatedentry/relatedEntries', array(
            'offset' => $offset,
            'limit' => $limit,
            'section' => $section,
            'relatedEntryId' => $relatedEntryId
        ));

	    $this->returnJson(array('entries' => trim($redered_template)));
    }

	/**
	 * Delete an entry through Ajax.
	 */
	public function actionDelete()
	{
		// Only perform this action if it's a POST through AJAX
	    $this->requirePostRequest();
        $this->requireAjaxRequest();

		// Retrieve POST data
		$entryId = craft()->request->getPost('entryId', false);

		// Delete entry
		if($entryId && is_numeric($entryId))
		{
			$result = craft()->entries->deleteEntryById($entryId);
			$this->returnJson(array('result' => $result));
		}
	}
}