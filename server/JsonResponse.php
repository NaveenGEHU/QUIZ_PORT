<?php
class JsonResponse {
    private $data = [];

    public function setSuccess($success) {
        $this->data['success'] = $success;
        return $this;
    }

    public function setMessage($message) {
        $this->data['message'] = $message;
        return $this;
    }

    public function setData($key, $value) {
        $this->data[$key] = $value;
        return $this;
    }

    public function setArray($array) {
        $this->data = array_merge($this->data, $array);
        return $this;
    }

    public function toJson() {
        return json_encode($this->data);
    }

    public function output() {
        echo $this->toJson();
    }
}
?>
